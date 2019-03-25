import { h, View, actionCreator } from 'typerapp'
import { HttpText } from 'typerapp/fx';
import { State } from './states'

const createAction = actionCreator<State>()('part')

const TextReceived = createAction<typeof HttpText>((state, params) => ({
    ...state,
    value: params.text.length,
}))

const RequestText = createAction<string>((state) => [
    state,
    HttpText.create(TextReceived, '/'),
])

export const view: View<State> = ({ part: state }, dispatch) => <div>
    {state.value} <button onClick={ev => dispatch(RequestText, '/')}>request</button>
</div>
