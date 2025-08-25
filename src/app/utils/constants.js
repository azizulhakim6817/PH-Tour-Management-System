export const ROLES = Object.freeze({
ADMIN: 'admin',
USER: 'user',
AGENT: 'agent'
});


export const WALLET_STATUS = Object.freeze({
ACTIVE: 'active',
BLOCKED: 'blocked'
});


export const TX_TYPES = Object.freeze({
DEPOSIT: 'DEPOSIT', // user self top-up
WITHDRAW: 'WITHDRAW', // user self cash-out
TRANSFER: 'TRANSFER', // user->user
CASH_IN: 'CASH_IN', // agent -> user
CASH_OUT: 'CASH_OUT' // agent <- user
});


export const TX_STATUS = Object.freeze({
PENDING: 'PENDING',
COMPLETED: 'COMPLETED',
REVERSED: 'REVERSED'
});