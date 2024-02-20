import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Dropdown } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles<string, { gap: number }>({
  wrapper: {
    display: 'flex',
    gap: ({ gap }) => gap,
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'hidden',
  },
});

export default function ButtonGroup(props) {
  const { items, gap = 8 } = props;

  const classes = useStyles({ gap });

  const wrapper = useRef(null);
  const moreBtn = useRef(null);
  const observer = useRef(null);

  const [widthMap, setWidthMap] = useState<Record<number, number>>();
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [moreBtnWidth, setMoreBtnWidth] = useState(0);

  useEffect(() => {
    setMoreBtnWidth(moreBtn.current.getBoundingClientRect().width);
    return () => {
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    setWidthMap(null); // layout all child
    setTimeout(() => {
      if (wrapper.current) {
        if (!observer.current) {
          observer.current = new ResizeObserver(() => {
            setWrapperWidth(wrapper.current.getBoundingClientRect().width);
          });
          observer.current.observe(wrapper.current);
        }

        setWidthMap(
          (Array.from(wrapper.current?.children ?? []) as HTMLElement[]).reduce(
            (wm, child, key) => {
              wm[key] = child.getBoundingClientRect().width;

              return wm;
            },
            {}
          )
        );
      }
    });
  }, [items]);

  const [internalItems, moreItems] = useMemo(() => {
    if (!widthMap || !wrapperWidth || !moreBtnWidth) {
      return [null, []];
    }

    let _wrapperWidth = wrapperWidth - moreBtnWidth - gap;
    let loopIndex = 0;
    while (_wrapperWidth > 0) {
      _wrapperWidth -= widthMap[loopIndex] + gap;
      loopIndex++;
    }

    return [items.slice(0, loopIndex - 1), items.slice(loopIndex - 1)];
  }, [wrapperWidth, widthMap, items, gap, moreBtnWidth]);

  let children = null;
  if (internalItems) {
    children = internalItems.map((item) => (
      <Button key={item.key}>{item.label}</Button>
    ));
  } else {
    children = items.map((item) => (
      <Button key={item.key}>{item.label}</Button>
    ));
  }

  return (
    <div className={classes.wrapper} ref={wrapper}>
      {children}
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
