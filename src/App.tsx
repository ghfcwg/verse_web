import React from 'react';
import { Stack, Text, Link, FontWeights, ITextStyles, SearchBox, FocusZone, FocusZoneDirection, List,
  ITheme, mergeStyleSets, getTheme, getFocusStyle, getRTL, Icon,
  TextField, DefaultButton, PrimaryButton, Panel, } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { useBoolean } from '@fluentui/react-hooks';
import https from 'https';


import './App.css';
export interface VerseItem {
    id: string;
    content: string;
    title: string;
    reference: string;
    url: string;
    rating: number;
}

const boldStyle: Partial<ITextStyles> = { root: { fontWeight: FontWeights.semibold, color: '#6200dc', } };

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
  successBox: {
    background:"green", color:"white", textAlign:"center"
  },
});


function onRenderCell(item?: VerseItem): JSX.Element {
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
}

export const App: React.FunctionComponent = () => {
  // start panel state
  const [items, setItems] = React.useState();

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);

  const [successMessage/*, setSuccessMessage*/] = React.useState('Successfully added highlight');
  const [successClass, setSuccessClass] = React.useState(false);

  // start highlight form state;   
  const [highlightUsername, setHighlightUsername] = React.useState(), [highlightUrl, setHighlightUrl] = React.useState();
  const [highlightStartXpath, setHighlightStartXpath] = React.useState(), [highlightStartHighlight, setHighlightStartHighlight] = React.useState();
  const [highlightEndXpath, setHighlightEndXpath] = React.useState(), [highlightEndHighlight, setHighlightEndHighlight] = React.useState();
  function highlightUsernameState(e: any) {
    setHighlightUsername(e.target.value);
  }
  function highlightUrlState(e: any) {
    setHighlightUrl(e.target.value);
  }
  function highlightStartXpathState(e: any) {
    setHighlightStartXpath(e.target.value);
  }
  function highlightStartHighlightState(e: any) {
    setHighlightStartHighlight(e.target.value);
  }
  function highlightEndXpathState(e: any) {
    setHighlightEndXpath(e.target.value);
  }
  function highlightEndHighlightState(e: any) {
    setHighlightEndHighlight(e.target.value);
  }
  function addHighlight() {
    // organize data from the highlight form
    const data = {
      user: highlightUsername,
      url: highlightUrl,
      startxpath: highlightStartXpath,
      starttext: highlightStartHighlight,
      endxpath: highlightEndXpath,
      endtext: highlightEndHighlight
    };
    console.log(data);
    // send POST request with data from the highlight form
    const req = https.request(
      {
        hostname: 'chungwon.glass',
        port: 8443,
        path: `/highlight`,
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': 'JSON.stringify(data)'
        }
      },
      res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.setEncoding('utf8');
        // let data = '';
        // res.on('data', (chunk) => {
        //   data += chunk;
        //   console.log('Body: ', chunk);
        // });
        //res.on('end', () => {
        console.log('Finished POST request.');
        setSuccessClass(true);
        setTimeout(() => {
          setSuccessClass(false);
        }, 6000);
        //});
      }).on('error', error => {
        console.error(error);
      });


    req.write(JSON.stringify(data));
    req.end();
  }
  // end highlight form state
  // end panel state
  function dbGetVerseListItems(query: string) {
    const queryenc = encodeURIComponent(query);
    console.debug(queryenc);

    const req = https.request(
      {
        hostname: 'chungwon.glass',
        port: 8443,
        path: `/query?q=${queryenc}`,
        method: 'GET'
      },
      function (res) {
        console.log(`statusCode: ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', d => {
          setItems(JSON.parse(d));
        });
      });

    req.on('error', error => {
      console.error(error);
    });

    req.end();
  }

  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      styles={{
        root: {
          width: '90%',
          margin: '0 auto',
          textAlign: 'center',
        }
      }}
      tokens={{ childrenGap: 5 }}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Verse - Hoon Dok Hae
      </Text>
      <Text variant="large" styles={{ root: { color: '#6200dc' } }}>Search speeches and texts of Father and Mother Moon.</Text>
      <SearchBox placeholder="Search" onSearch={(newValue: string) => dbGetVerseListItems(newValue)} styles={{
        root: {
          //width: '30%',
        }
      }} />
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
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField // prettier-ignore

            label="username"
            aria-label="username text field, required"
            required
            value={highlightUsername}
            onChange={highlightUsernameState} />
          <TextField // prettier-ignore

            label="url"
            placeholder="http://"
            aria-label="url text field with http:// placeholder"
            value={highlightUrl}
            onChange={highlightUrlState} />
          <TextField // prettier-ignore

            label="XPath Highlight Start"
            placeholder="/html/"
            aria-label="start xpath text field with /html/ placeholder"
            value={highlightStartXpath}
            onChange={highlightStartXpathState} />
          <TextField label="Text at Start of Highlight" multiline autoAdjustHeight
            aria-label="start of highlight text field, multiline auto adjust height"
            value={highlightStartHighlight}
            onChange={highlightStartHighlightState} />
          <TextField // prettier-ignore

            label="XPath Highlight End"
            placeholder="/html/"
            aria-label="end xpath text field with /html/ placeholder"
            value={highlightEndXpath}
            onChange={highlightEndXpathState} />
          <TextField label="Text at End of Highlight" multiline autoAdjustHeight
            aria-label="end of highlight text field, multiline auto adjust height"
            value={highlightEndHighlight}
            onChange={highlightEndHighlightState} />
          <PrimaryButton onClick={addHighlight}>Save Highlight</PrimaryButton>
          <div
            className={classNames.successBox}
            style={successClass ?
              { opacity: 1, transition: "opacity 1s ease-in-out", }
              :
              { opacity: 0, transition: "opacity 1s ease-in-out", }}
          >
            {successMessage}
          </div>
        </Stack>
      </Panel>
    </Stack>
  );
};
