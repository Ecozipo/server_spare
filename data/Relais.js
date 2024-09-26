let state_relay = {
    state:{},
    delta:{}
}


export const get_relay_state = ()=>{
    const {state} = state_relay
    return state
}

export const set_relay_state = (state)=>{
    state_relay.state = state
}

export const set_relay_delta = (delta)=>{
    state_relay.delta = delta
}
