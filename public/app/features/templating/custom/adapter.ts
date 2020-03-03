import cloneDeep from 'lodash/cloneDeep';
import { CustomVariableModel } from '../variable';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl, toVariableIdentifier } from '../state/actions';
import { VariableAdapter } from '../adapters';
import { customVariableReducer, initialCustomVariableModelState } from './reducer';
import { OptionsPicker } from '../pickers';
import { CustomVariableEditor } from './CustomVariableEditor';
import { updateCustomVariableOptions } from './actions';
import { ALL_VARIABLE_TEXT } from '../state/types';

export const createCustomVariableAdapter = (): VariableAdapter<CustomVariableModel> => {
  return {
    description: 'Define variable values manually',
    label: 'Custom',
    initialState: initialCustomVariableModelState,
    reducer: customVariableReducer,
    picker: OptionsPicker,
    editor: CustomVariableEditor,
    dependsOn: () => {
      return false;
    },
    setValue: async (variable, option, emitChanges = false) => {
      await dispatch(setOptionAsCurrent(toVariableIdentifier(variable), option, emitChanges));
    },
    setValueFromUrl: async (variable, urlValue) => {
      await dispatch(setOptionFromUrl(toVariableIdentifier(variable), urlValue));
    },
    updateOptions: async variable => {
      await dispatch(updateCustomVariableOptions(toVariableIdentifier(variable)));
    },
    getSaveModel: variable => {
      const { index, initLock, global, ...rest } = cloneDeep(variable);
      return rest;
    },
    getValueForUrl: variable => {
      if (variable.current.text === ALL_VARIABLE_TEXT) {
        return ALL_VARIABLE_TEXT;
      }
      return variable.current.value;
    },
  };
};
