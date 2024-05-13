import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Dropdown } from 'antd';
import { createUseStyles } from 'react-jss';
import textWidthGetter from './useTextWidthGetter';

const useStyles = createUseStyles<string, { gap: number }>({
  wrapper: {
    display: 'flex',
    gap: ({ gap }) => gap,
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'hidden',
  },
});

const buttonGapX = (15 /** button's padding */ + 1) * 2;

export default function ButtonGroup2(props) {
  const { items, gap = 8 } = props;

  const classes = useStyles({ gap });

  const wrapper = useRef(null);
  const moreBtn = useRef(null);
  const observer = useRef(null);

  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [font, setFont] = useState('14px system-ui');

  const moreBtnWidth = useMemo(() => {
    return (
      textWidthGetter({
        text: '更多',
        font,
      }) + buttonGapX
    );
  }, [font]);

  useEffect(() => {
    const { fontSize, fontFamily } = getComputedStyle(moreBtn.current);

    setFont(`${fontSize} ${fontFamily}`);

    return () => {
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (wrapper.current) {
      if (!observer.current) {
        observer.current = new ResizeObserver(() => {
          setWrapperWidth(wrapper.current.getBoundingClientRect().width);
        });
        observer.current.observe(wrapper.current);
      }
    }
  }, [items]);

  const [internalItems, moreItems] = useMemo(() => {
    if (!wrapperWidth || !moreBtnWidth) {
      return [[], []];
    }

    let _wrapperWidth = wrapperWidth - moreBtnWidth - gap;
    let loopIndex = 0;
    while (_wrapperWidth > 0) {
      const buttonWidth =
        textWidthGetter({
          text: items[0].label,
          font,
        }) + buttonGapX;

      _wrapperWidth -= buttonWidth + gap;
      loopIndex++;
    }

    return [items.slice(0, loopIndex - 1), items.slice(loopIndex - 1)];
  }, [wrapperWidth, items, gap, font, moreBtnWidth]);

  return (
    <div className={classes.wrapper} ref={wrapper}>
      {internalItems.map((item) => (
        <Button key={item.key}>{item.label}</Button>
      ))}
      <Dropdown
        menu={{
          items: moreItems,
          style: { maxHeight: '30vh', overflowY: 'auto' },
        }}
        trigger={['click']}
      >
        <Button ref={moreBtn}>更多</Button>
      </Dropdown>
    </div>
  );
}
