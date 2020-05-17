import React, { useState } from 'react';
import { Stack, Text, Link, FontWeights, SearchBox, FocusZone, FocusZoneDirection, List,
  ITheme, mergeStyleSets, getTheme, getFocusStyle, getRTL, Icon, initializeIcons, } from 'office-ui-fabric-react';
import https from 'https';
import { VerseItem } from './VerseItem';

const boldStyle = {
  root: { fontWeight: FontWeights.semibold,
    color: '#6200dc',}
};

initializeIcons(/* optional base url */);

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: 'flex',
      selectors: {
        '&:hover': { background: palette.neutralLight },
      },
    },
  ],
  itemImage: {
    flexShrink: 0,
  },
  itemContent: {
    marginLeft: 10,
    /*overflow: 'hidden',*/
    flexGrow: 1,
    textAlign: 'left',
    maxWidth: '360px',
  },
  itemName: [
    fonts.xLarge,
    /*{
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },*/
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
  },
});


const onRenderCell = (item?: VerseItem): JSX.Element => {
  return (
    <div className={classNames.itemCell} data-is-focusable={true}>
      <div className={classNames.itemContent}>
        <div className={classNames.itemName}>{item!.title} - {item!.reference}</div>
        <div className={classNames.itemIndex}><Link href={item!.url}>{item!.url}</Link></div>
        <div>{item!.content}</div>
      </div>
      <Icon className={classNames.chevron} iconName={getRTL() ? 'ChevronLeft' : 'ChevronRight'} />
    </div>
  );
};

export const App: React.FunctionComponent = () => {
    
  const [items, setItems] = React.useState();

  const dbGetVerseListItems = (query?: string) => {

    const req = https.request(
        {hostname: 'chungwon.glass',
        port: 8443,
        path: `/query?q=${query}`,
        method: 'GET'}, 
        res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.setEncoding('utf8');
        
            res.on('data', d => {
                setItems(JSON.parse(d))
            })
        })
        
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
  }

  return (
    <Stack
      verticalFill
      horizontalAlign = "center"
      styles={{
        root: {
          width: '90%',
          margin: '0 auto',
          textAlign: 'center',
        }
      }}
      gap={15}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Verse - Hoon Dok Hae
      </Text>
      <Text variant="large" styles={{root: { color: '#6200dc'}}}>Search through the speeches and words of the Reverend Drs. Sun Myung Moon and Hak Ja Han Moon.</Text>
      <SearchBox placeholder="Search" onSearch={newValue => dbGetVerseListItems(newValue)} styles={{
        root: {
          width: '30%',
        }}}/>
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={items} onRenderCell={onRenderCell} />
      </FocusZone>
    </Stack>
  );
};
