/**
 * Hype Music Foundry
 * Plays custom hype music tracks when a player's turn begins in combat
 */

class HypeMusicConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "hype-music-config",
      title: game.i18n.localize("HYPEMUSIC.ConfigTitle"),
      template: "modules/hype-music-foundry/templates/config.html",
      width: 600,
      height: "auto",
      closeOnSubmit: true
    });
  }

  getData() {
    const actors = game.actors.filter(a => a.hasPlayerOwner);
    const tracks = game.playlists.contents.flatMap(playlist => 
      playlist.sounds.map(sound => ({
        id: sound.id,
        name: `${playlist.name} - ${sound.name}`,
        path: sound.path,
        playlistId: playlist.id
      }))
    );

    const actorsData = actors.map(actor => {
      const hypeTrack = actor.getFlag("hype-music-foundry", "hypeTrack");
      return {
        id: actor.id,
        name: actor.name,
        img: actor.img,
        hypeTrack: hypeTrack || null
      };
    });

    return {
      actors: actorsData,
      tracks: tracks
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".clear-track").click(async (event) => {
      event.preventDefault();
      const actorId = $(event.currentTarget).data("actor-id");
      const actor = game.actors.get(actorId);
      if (actor) {
        await actor.unsetFlag("hype-music-foundry", "hypeTrack");
        this.render();
      }
    });

    html.find(".play-preview").click(async (event) => {
      event.preventDefault();
      const select = $(event.currentTarget).closest("tr").find("select");
      const trackData = select.val();
      if (trackData) {
        try {
          const data = JSON.parse(trackData);
          await HypeMusicFoundry.playTrack(data);
        } catch (e) {
          ui.notifications.error("Failed to parse track data for preview.");
        }
      } else {
        ui.notifications.warn("No track selected to preview.");
      }
    });
  }

  async _updateObject(event, formData) {
    for (let [key, value] of Object.entries(formData)) {
      if (key.startsWith("track-")) {
        const actorId = key.replace("track-", "");
        const actor = game.actors.get(actorId);
        if (!actor) continue;
        if (value) {
          try {
            const trackData = JSON.parse(value);
            await actor.setFlag("hype-music-foundry", "hypeTrack", trackData);
          } catch (e) {
            ui.notifications.error("Failed to save hype track for " + actor.name);
          }
        } else {
          await actor.unsetFlag("hype-music-foundry", "hypeTrack");
        }
      }
    }
    ui.notifications.info("Hype music configuration saved!");
  }
}

class HypeMusicFoundry {
  static MODULE_ID = "hype-music-foundry";
  static currentlyPlaying = null;

  static async playTrack(trackData) {
    if (!trackData) return;

    // Stop currently playing hype track if any
    if (this.currentlyPlaying) {
      try {
        await this.currentlyPlaying.sound.update({ playing: false, pausedTime: 0 });
      } catch (e) {}
      this.currentlyPlaying = null;
    }

    // Find the playlist and sound (v13+ API safe)
    const playlist = game.playlists.get(trackData.playlistId) || game.playlists.contents.find(p => p.id === trackData.playlistId);
    if (!playlist) {
      ui.notifications.warn("Hype Music Foundry: Playlist not found");
      return;
    }

    let sound = null;
    if (playlist.sounds instanceof Map || typeof playlist.sounds.get === "function") {
      sound = playlist.sounds.get(trackData.id);
    } else if (Array.isArray(playlist.sounds)) {
      sound = playlist.sounds.find(s => s.id === trackData.id);
    }
    if (!sound) {
      ui.notifications.warn("Hype Music Foundry: Sound not found");
      return;
    }

    // Get volume setting
    const volume = game.settings.get(this.MODULE_ID, "volume") / 100;

    // Play the track (v13+ API safe)
    if (typeof playlist.playSound === "function") {
      await playlist.playSound(sound, { volume });
    } else if (typeof sound.play === "function") {
      await sound.play({ volume });
    } else {
      ui.notifications.error("Hype Music Foundry: Unable to play sound (API mismatch)");
      return;
    }
    this.currentlyPlaying = { playlist, sound };
  }

  static async onCombatTurn(combat, updateData, options) {
    // Check if it's actually a turn change
    if (!updateData.turn && updateData.turn !== 0) return;
    
    // Check if hype music is enabled
    const enabled = game.settings.get(this.MODULE_ID, "enabled");
    if (!enabled) return;

    const combatant = combat.combatant;
    if (!combatant || !combatant.actor) return;

    // Get the hype track for this actor
    const hypeTrack = combatant.actor.getFlag(this.MODULE_ID, "hypeTrack");
    
    if (hypeTrack) {
      await this.playTrack(hypeTrack);
    }
  }

  static async onCombatEnd(combat) {
    // Stop currently playing hype track when combat ends
    if (this.currentlyPlaying) {
      await this.currentlyPlaying.sound.update({ playing: false, pausedTime: 0 });
      this.currentlyPlaying = null;
    }
  }

  static addActorSheetButton(app, html, data) {
    // Only show to GMs
    if (!game.user.isGM) return;

    // Only for actors with player owners
    if (!app.actor.hasPlayerOwner) return;

    const hypeTrack = app.actor.getFlag(HypeMusicFoundry.MODULE_ID, "hypeTrack");
    const hasTrack = hypeTrack ? "✓" : "";

    const button = $(`
      <a class="hype-music-button" title="${game.i18n.localize("HYPEMUSIC.ButtonTitle")}">
        <i class="fas fa-music"></i> ${hasTrack}
      </a>
    `);

    button.click(async () => {
      new HypeMusicConfig().render(true);
    });

    const titleElement = html.find(".window-title");
    button.insertAfter(titleElement);
  }
}

// Initialize the module
Hooks.once("init", () => {
  console.log("Hype Music Foundry | Initializing");

  // Register settings
  game.settings.register(HypeMusicFoundry.MODULE_ID, "enabled", {
    name: game.i18n.localize("HYPEMUSIC.SettingName"),
    hint: game.i18n.localize("HYPEMUSIC.SettingHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(HypeMusicFoundry.MODULE_ID, "volume", {
    name: game.i18n.localize("HYPEMUSIC.VolumeSettingName"),
    hint: game.i18n.localize("HYPEMUSIC.VolumeSettingHint"),
    scope: "world",
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 5
    },
    default: 80
  });
});

Hooks.once("ready", () => {
  console.log("Hype Music Foundry | Ready");

  // Add configuration button to settings
  game.settings.registerMenu(HypeMusicFoundry.MODULE_ID, "config", {
    name: game.i18n.localize("HYPEMUSIC.ConfigTitle"),
    label: game.i18n.localize("HYPEMUSIC.ButtonTitle"),
    icon: "fas fa-music",
    type: HypeMusicConfig,
    restricted: true
  });
});

// Hook into combat turn changes
Hooks.on("updateCombat", HypeMusicFoundry.onCombatTurn.bind(HypeMusicFoundry));

// Hook into combat end
Hooks.on("deleteCombat", HypeMusicFoundry.onCombatEnd.bind(HypeMusicFoundry));

// Add button to actor sheets
Hooks.on("renderActorSheet", HypeMusicFoundry.addActorSheetButton);
