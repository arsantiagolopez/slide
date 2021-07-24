/**
 * Create a random stacked gradient in the format of
 * background:
 *    linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
 *    linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
 */

// Get random angle
const randomAngle = () => Math.round(Math.random() * 360);

// Get only light colours
const getRandomColor = () => `hsl(${Math.random() * 360}, 100%, 75%)`;

// Create random stacked gradient
const generateGradientAvatar = () => {
  const gradient1 = `linear-gradient(${randomAngle()}deg, ${getRandomColor()}, ${getRandomColor()})`;
  const gradient2 = `linear-gradient(${randomAngle()}deg, ${getRandomColor()}, ${getRandomColor()})`;

  return `${gradient1}, ${gradient2}`;
};

export { generateGradientAvatar };
