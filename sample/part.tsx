import { h, View, actionCreator } from 'typerapp'
import { httpText } from 'typerapp/fx';
import { State } from './states'

const createAction = actionCreator<State>()('part')

const TextReceived = createAction<{ text: string }>((state, payload) => ({
    ...state,
    value: payload.text.length,
}))

const RequestText = createAction<string>((state, url) => [
    state,
    httpText([TextReceived, res => ({ text: res.text })], url),
])

export const view: View<State> = ({ part: state }, dispatch) => <div>
    {state.value} <button onClick={ev => dispatch(RequestText, '/')}>request</button>
</div>
