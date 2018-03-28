export const actionTypes = {
  START_LOOP: 'CORE/LOOP/START',
  TICK_LOOP: 'CORE/LOOP/TICK',
};

export const startLoop = () => ({
  type: actionTypes.START_LOOP,
});

export const tickLoop = ({ fps }) => {
  return { type: actionTypes.TICK_LOOP, payload: { fps } };
};