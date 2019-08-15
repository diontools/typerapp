import { h, View, actionCreator } from 'typerapp'
import { httpText } from 'typerapp/fx';
import { State } from './states'

const createAction = actionCreator<State>()('part')

const TextReceived = createAction<{ text: string }>((state, params) => ({
    ...state,
    value: params.text.length,
}))

const RequestText = createAction<string>((state) => [
    state,
    httpText([TextReceived, res => ({ text: res.text })], '/'),
])

export const view: View<State> = ({ part: state }, dispatch) => <div>
    {state.value} <button onClick={ev => dispatch(RequestText, '/')}>request</button>
</div>
