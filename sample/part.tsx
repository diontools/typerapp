import { h, View, actionCreator } from 'typerapp'
import { HttpText } from 'typerapp/fx';
import { State } from './states'

const createPartAction = actionCreator<State>()('part')

const TextReceived = createPartAction<typeof HttpText>((state, params) => ({
    ...state,
    value: params.text.length,
}))

const RequestText = createPartAction((state) => [
    state,
    HttpText.create(TextReceived, '/'),
])

export const view: View<State> = ({ part: state }, dispatch) => (
    <div>
        {state.value} <button onClick={ev => dispatch(RequestText)}>request</button>
    </div>
)