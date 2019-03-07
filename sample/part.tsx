import { h, Effect, Subscription, PartialView, PartialAction } from 'typerapp'
import { State } from './states'
import { Delay } from './effects';

const Add: PartialAction<State, 'part', { amount: number }> = (state, params) => ({
    ...state,
    p: state.p + params.amount,
})

export const view: PartialView<State, 'part'> = (root, state, dispatch) => (
    <div>
        {state.p} <button onClick={ev => dispatch(root, Add, { amount: 1 })}>add</button>
    </div>
)