import { h, Action, View } from 'typerapp'
import { Delay } from 'typerapp/fx';
import { State } from './states'

const DelayedCountUp = Delay.createAction<State>(state => ({ ...state, part: { p: state.part.p + 1 } }))

const Add: Action<State, { amount: number }> = (state, params) => [
    { ...state, part: { p: state.part.p + params.amount } },
    Delay.create(DelayedCountUp, { duration: 200 })
]

export const view: View<State> = ({ part: state }, dispatch) => (
    <div>
        {state.p} <button onClick={ev => dispatch(Add, { amount: 1 })}>add</button>
    </div>
)