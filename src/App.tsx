import { useState } from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import ButtonGroup from './ButtonGroup';

const radomLetter = () => String.fromCharCode(65 + Math.floor(_.random(0, 25)));

const randomText = () => {
  // const textLength = _.random(5, 8);
  const textLength = _.random(10, 11);

  let text = '';
  for (let i = 0; i < textLength; i++) {
    text += radomLetter();
  }

  return text;
};

const initItems = () =>
  Array(30)
    .fill(0)
    .map((zero, key) => ({
      key,
      label: `btn-${randomText()}`,
    }));

export default function App() {
  const [items, setItems] = useState(initItems);

  return (
    <>
      <h1>resize screen to view button group</h1>
      <Button
        onClick={() => {
          setItems(initItems());
        }}
        style={{ marginBottom: 16 }}
      >
        reset
      </Button>
      <ButtonGroup items={items} />
    </>
  );
}
