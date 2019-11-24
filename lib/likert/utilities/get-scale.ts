import { LikertOptionInterface } from '../../likert';
import getId from '../../utilities/ts/get-id';

const getScale = (
  options: LikertOptionInterface[]
): LikertOptionInterface[] => {
  const OPTIONS: LikertOptionInterface[] = [];

  let range: number = options.length;

  if (range < 3) {
    range = 3;
  }
  if (range > 11) {
    range = 11;
  }

  for (let i: number = 0; i < range; i++) {
    const OPTION: LikertOptionInterface = {
      id: getId(),
      label: !!options[i] && !!options[i].label ? options[i].label : ``
    };

    OPTIONS.push(OPTION);
  }

  return OPTIONS;
};

export { getScale as default };
