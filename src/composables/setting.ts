export interface Settings {
  withModifyKey: boolean;
}

const state = useStorage(
  'sdu-map-admin-setting',
  {
    dragWithoutModifyKey: false,
    scale: true,
    rotate: false
  },
  localStorage,
  { mergeDefaults: true }
);

export const useSetting = function () {
  return state;
};
