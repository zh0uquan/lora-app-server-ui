// shim code from:
// https://github.com/websockets/ws/issues/1093

export const ws = new WebSocket(window.location.origin.replace('http', 'ws'));
