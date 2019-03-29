import { h, View, actionCreator, ActionParamOf } from 'typerapp'
import { httpText } from 'typerapp/fx';
import { State } from './states'

const createAction = actionCreator<State>()('part')

const TextReceived = createAction<ActionParamOf<typeof httpText>>((state, params) => ({
    ...state,
    value: params.text.length,
}))

const RequestText = createAction<string>((state) => [
    state,
    httpText(TextReceived, '/'),
])

export const view: View<State> = ({ part: state }, dispatch) => <div>
    {state.value} <button onClick={ev => dispatch(RequestText, '/')}>request</button>
</div>
