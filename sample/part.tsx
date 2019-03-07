import { h, Effect, Subscription, Action, View } from 'typerapp'
import { State } from './states'
import { Delay } from './effects';

const Add: Action<State, { amount: number }> = (state, params) => ({
    ...state,
    part: { p: state.part.p + params.amount },
})

export const view: View<State> = (state, dispatch) => (
    <div>
        {state.part.p} <button onClick={ev => dispatch(Add, { amount: 1 })}>add</button>
    </div>
)