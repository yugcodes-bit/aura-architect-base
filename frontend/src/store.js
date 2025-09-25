// src/store.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  // State
  models: [],
  selectedObject: null,
  transformMode: 'translate',

  // Actions
  setModels: (newModels) => set({ models: newModels }),
  addModel: (newModel) => set((state) => ({ models: [...state.models, newModel] })),
  deleteSelectedObject: () => set((state) => {
    if (!state.selectedObject) return state;
    return {
      models: state.models.filter(m => m.instanceId !== state.selectedObject.userData.instanceId),
      selectedObject: null,
    };
  }),
  setSelectedObject: (object) => set({ selectedObject: object }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  updateModelTransform: (instanceId, newPosition, newRotation, newScale) => set((state) => ({
    models: state.models.map(model => 
      model.instanceId === instanceId 
        ? { ...model, position: newPosition, rotation: newRotation, scale: newScale } 
        : model
    )
  })),
}));