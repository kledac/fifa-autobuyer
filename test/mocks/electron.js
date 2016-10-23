import { spy } from 'sinon';

const electronState = {
  fullscreen: false,
  maximized: false
};

export default {
  shell: {
    openExternal: spy(() => true)
  },
  remote: {
    getCurrentWindow: () => ({
      isFullScreen: spy(() => electronState.fullscreen),
      setFullScreen: spy(bool => { electronState.fullscreen = bool; }),
      close: spy(),
      hide: spy(),
      minimize: spy(),
      isMaximized: spy(() => electronState.maximized),
      unmaximize: spy(() => { electronState.maximized = false; }),
      maximize: spy(() => { electronState.maximized = true; })
    }),
    dialog: {
      // Assume affermitive action at index 0
      showMessageBox: spy((obj, cb) => {
        cb(0);
      })
    },
    Menu: spy(() => ({
      append: spy(),
      popup: spy()
    })),
    MenuItem: spy(() => {})
  }
};
