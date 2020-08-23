import React, { useState } from 'react';
import { Stack, Text, Link, FontWeights, SearchBox, FocusZone, FocusZoneDirection, List,
  ITheme, mergeStyleSets, getTheme, getFocusStyle, getRTL, Icon, initializeIcons, } from 'office-ui-fabric-react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { useConstCallback } from '@uifabric/react-hooks';
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
  // start panel state
  const [items, setItems] = React.useState();
  const [isOpen, setIsOpen] = React.useState(false);

  const openPanel = useConstCallback(() => setIsOpen(true));
  const dismissPanel = useConstCallback(() => setIsOpen(false));  

    // start highlight form state;   
    const [highlightUsername, setHighlightUsername] = React.useState();
    const [highlightUrl, setHighlightUrl] = React.useState();
    const [highlightStartXpath, setHighlightStartXpath] = React.useState()
    const [highlightStartHighlight, setHighlightStartHighlight] = React.useState()
    const [highlightEndXpath, setHighlightEndXpath] = React.useState()
    const [highlightEndHighlight, setHighlightEndHighlight] = React.useState()
    const highlightUsernameState = (e: any) => {
      setHighlightUsername(e.target.value);
    }
    const highlightUrlState = (e: any) => {
      setHighlightUrl(e.target.value);
    }
    const highlightStartXpathState = (e: any) => {
      setHighlightStartXpath(e.target.value);
    }
    const highlightStartHighlightState = (e: any) => {
      setHighlightStartHighlight(e.target.value);
    }
    const highlightEndXpathState = (e: any) => {
      setHighlightEndXpath(e.target.value);
    }
    const highlightEndHighlightState = (e: any) => {
      setHighlightEndHighlight(e.target.value);
    }
    const addHighlight = () => {
      // organize data from the highlight form
      const data = JSON.stringify({
          username: highlightUsername,
          url: highlightUrl,
          startxpath: highlightStartXpath,
          starttext: highlightStartHighlight,
          endxpath: highlightEndXpath,
          endtext: highlightEndHighlight
      });
      // send POST request with data from the highlight form
      const req = https.request(
        {
          hostname: 'chungwon.glass',
          port: 8443,
          path: `/highlight`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        }, 
        res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.setEncoding('utf8');
            let data = '';
        
            res.on('data', (chunk) => {
              data += chunk;
            });
        
            res.on('end', () => {
                console.log('Body: ', JSON.parse(data));
            });
        }).on('error', error => {
          console.error(error)
      })
      

      req.write(data);
      req.end()
    }
    const setTodo = (e: any) =>{
        setTodo(e.target.value);
    }
    // end highlight form state
  // end panel state

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
      <DefaultButton text="Create Highlight" onClick={openPanel} />
      <FocusZone direction={FocusZoneDirection.vertical}>
        <List items={items} onRenderCell={onRenderCell} />
      </FocusZone>
      <Panel
        headerText="Create New Highlight"
        isOpen={isOpen}
        onDismiss={dismissPanel}
        // this prop prevents clearing of all field data in the panel if it's closed
        //isHiddenOnDismiss={true}
        // this prop makes the panel non-modal
        isBlocking={false}
        // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
        closeButtonAriaLabel="Close"
      >
        <Stack>
          <TextField // prettier-ignore
            label="username"
            ariaLabel="username text field, required"
            required
            value={highlightUsername}
            onChange={highlightUsernameState}
          />
          <TextField // prettier-ignore
            label="url"
            placeholder="http://"
            ariaLabel="url text field with http:// placeholder"
            value={highlightUrl}
            onChange={highlightUrlState}
          />
          <TextField // prettier-ignore
            label="XPath Highlight Start"
            placeholder="/html/"
            ariaLabel="start xpath text field with /html/ placeholder"
            value={highlightStartXpath}
            onChange={highlightStartXpathState}
          />
          <TextField label="Text at Start of Highlight" multiline autoAdjustHeight 
            ariaLabel="start of highlight text field, multiline auto adjust height"
            value={highlightStartHighlight}
            onChange={highlightStartHighlightState}
          />
          <TextField // prettier-ignore
            label="XPath Highlight End"
            placeholder="/html/"
            ariaLabel="end xpath text field with /html/ placeholder"
            value={highlightEndXpath}
            onChange={highlightEndXpathState}
          />
          <TextField label="Text at End of Highlight" multiline autoAdjustHeight 
            ariaLabel="end of highlight text field, multiline auto adjust height"
            value={highlightEndHighlight}
            onChange={highlightEndHighlightState}
          /> 
          <PrimaryButton onClick={addHighlight} >Save Highlight</PrimaryButton>
        </Stack>
      </Panel>
    </Stack>
  );
};
