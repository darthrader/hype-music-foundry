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
      const select = $(event.currentTarget).siblings("select");
      const trackData = select.val();
      if (trackData) {
        const data = JSON.parse(trackData);
        HypeMusicFoundry.playTrack(data);
      }
    });
  }

  async _updateObject(event, formData) {
    for (let [key, value] of Object.entries(formData)) {
      if (key.startsWith("track-")) {
        const actorId = key.replace("track-", "");
        const actor = game.actors.get(actorId);
        
        if (actor && value) {
          const trackData = JSON.parse(value);
          await actor.setFlag("hype-music-foundry", "hypeTrack", trackData);
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
      await this.currentlyPlaying.sound.update({ playing: false, pausedTime: 0 });
      this.currentlyPlaying = null;
    }

    // Find the playlist and sound
    const playlist = game.playlists.get(trackData.playlistId);
    if (!playlist) {
      console.warn("Hype Music Foundry: Playlist not found");
      return;
    }

    const sound = playlist.sounds.get(trackData.id);
    if (!sound) {
      console.warn("Hype Music Foundry: Sound not found");
      return;
    }

    // Get volume setting
    const volume = game.settings.get(this.MODULE_ID, "volume") / 100;

    // Play the track
    await playlist.playSound(sound, { volume: volume });
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
