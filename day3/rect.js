const regexp = /^#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)$/;

/**
 * 
 * @param {String} input 
 */
const parse = (input) => {
  if (!input) return null;
  const result = input.match(regexp);
  if (!result) return null;
  const [, id, left, top, width, height ] = result;
  return {
    id: +id,
    left: +left,
    top: +top,
    width: +width,
    height: +height
  };
}

module.exports = {
  parse
};