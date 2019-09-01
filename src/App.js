import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

import { color, Spell, CasterLabel } from './spell';
import Spells from './spells';
import avatar from './taurus2.jpg';

const casters = [
    'bard',
    'cleric',
    'druid',
    'paladin',
    'ranger',
    'sorcerer',
    'warlock',
    'wizard'
]

const EditModeMessage = styled.div`
    background-color: ${color.paladin};
    color: #222;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.75em;
    font-family: 'Lato', sans-serif;
    padding: 1em;
    margin: 1em 0;

    p {
        color: #222;
        margin: 0 0 1em 0;
    }
`;

const ConicGradientMessage = styled.div`
    @supports (background: conic-gradient(rgb(76, 136, 255) 0%, rgb(76, 136, 255) 100%)) {
        display: none;
    }
    background-color: ${color.paladin};
    color: #222;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.75em;
    font-family: 'Lato', sans-serif;
    padding: 1em;
    margin: 1em 0;
`;

const CopyrightMessage = styled.p`
    color: #666;
    column-span: all;
    font-size: 0.75em;
`;

const HighlightLabel = styled.span`
    margin-right: 0.5em;
    color: #aaa;
    text-transform: uppercase;
`;

function Button(props) {

    return <button className={props.className} href="#" onClick={() => props.onClick()}>{props.label}</button>
}

const StyledButton = styled(Button)`
    border: 1px solid ${props => props.color ? props.color : '#ccc'};
    border-radius: 0.75rem;
    background: ${props => props.filled
        ? props.color
            ? props.color
            : '#ccc'
        : '#222' };
    color: ${props => props.filled
        ? '#222'
        : props.color
            ? props.color
            : '#ccc'};
    font-family: 'Lato', sans-serif;
    font-size: 1em;
    line-height: 1.3;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.75em 1em;
    margin: 0.5em;
    cursor: pointer;
    outline: none;

    :hover {
        border: 1px solid ${props => props.filled
        ? '#222'
        : props.color
            ? lighten(0.1, props.color)
            : '#fff'};
        color: ${props => props.filled
            ? '#222'
            : props.color
                ? lighten(0.1, props.color)
                : '#fff'};
        background: ${props => props.filled
            ? props.color
                ? lighten(0.1, props.color)
                : '#ccc'
            : '#222' };;
    }
`;

function swap(spells, i1, i2) {

    return spells.map((spell, index) => {
        switch (index) {
            case i1: return {...spell, coordinates: spells[i2].coordinates};
            case i2: return {...spell, coordinates: spells[i1].coordinates};
            default: return spell;
        }
    });
}

const ResetButtonWrapper = styled.div`
    display: inline;
`;

const Wrapper = styled.div`
    font-size: 3vw;

    @media screen and (min-width: 601px) {
        font-size: 16px;
    }
`;

const Header = styled.header`
    padding: 1.5em 1.5em 1em;
    text-align: center;

    h1 {
        font-size: 2em;
        margin: 0;
    }

    h3 {
        font-family: 'Merriweather', serif;
        font-size: 1em;
        font-weight: normal;
        line-height: 1.7;
        color: #aaa;
        margin: 1em auto 0;
    }

    ${CasterLabel} {

        :after {
            content: 's';
        }

        :not(:last-of-type) {
            :after {
                content: 's, ';
            }
        }
    }
`;

const BoardWrapper = styled.div`
    margin: 0 auto;

    @media only screen and (orientation: portrait) {
        max-width: 95vw;
    }

    @media only screen and (orientation: landscape) {
        max-width: 85vh;
    }
`;

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.25em;
    margin: 0.5em;

    @media only screen and (min-width: 1920px) {
        grid-gap: 0.25vw;
    }
`;

const Aside = styled.aside`
    max-width: 600px;
    margin: 0 auto;
    color: #aaa;
    padding: 1em 1.5em;
    text-align: left;

    @media only screen and (min-width: 600px) {
        columns: 2 10em;
        column-gap: 1.5em;
    }

    h2 {
        color: #fff;
        font-size: 1.25em;
        margin: 0 auto 1em;
        text-transform: uppercase;
    }

    p {
        font-family: 'Merriweather', serif;
        line-height: 1.7;
        margin: 0 auto 1em;
    }

    ${CopyrightMessage} {
        margin-top: 2em;
    }

    img {
        width: 7em;
        border-radius: 50%;
    }
`;

const Logo = styled.div`
    margin-top: 2em;
    text-align: center;
    column-span: all;
    a {
        text-decoration: none;
    }
`;

const ColumnBreakerH2 = styled.h2`
    @media only screen and (min-width: 800px) {
        break-before: column;
        margin-top: 0;
    }
`;

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false,
            'highlightedCasters': [],
            'editMode': false,
            'timeSinceLastSave': 0
        };

        var currentKey=0;
        for (currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            //console.log(this.state.spells[currentKey]);
        }

        this.state.selectedId = false;
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.editMode) {
            this.setState({
                'timeSinceLastSave': this.state['timeSinceLastSave'] + 1000
            });
            if (this.state['timeSinceLastSave'] > 100000) {
                this.handleSave(this.state.spells);
                this.setState({
                    'timeSinceLastSave': 0
                });
                console.log('Saved');
            }
        }
    }

    handleSave(jsonData) {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.json';
        link.href = url;
        link.click();
    }

    handleHighlightClick(caster) {
        if (this.state.highlightedCasters.includes(caster)) {
            this.setState({highlightedCasters: this.state.highlightedCasters.filter(hcaster => hcaster !== caster)});
        } else {
            var newCasters = this.state.highlightedCasters;
            newCasters.push(caster);
            this.setState({highlightedCasters: newCasters});
        }
    }

    handleClick(i) {
        if (this.state.editMode) {
            if (this.state.selectedId === i) {
                this.setState({'selectedId': false});
                //console.log('unselected: '+i);
            } else if (this.state.selectedId) {
                //console.log('switching position of ' + this.state.selectedId + ' and ' + i);
                const { spells, selectedId } = this.state;
                this.setState({
                    spells: swap(spells, Number(i), Number(selectedId)),
                    selectedId: false
                });
            } else {
                this.setState({selectedId: i});
                //console.log('selected: ' + i);
            }
        } else {
            /*if (this.state.highlightedCasters === this.state.spells[i].casters) {
                this.setState({highlightedCasters: []});
            } else {
                this.setState({highlightedCasters: this.state.spells[i].casters});
            }*/
        }
    }

    getHighlightColors(casters) {

        return casters.filter(value => this.state.highlightedCasters.includes(value));
    }

    renderEditUi() {
        if (this.state.editMode) {

            return (
                <EditModeMessage>
                    <p>EDIT MODE, AUTOSAVING</p>
                    <StyledButton onClick={() => this.handleSave(this.state.spells)} label='Save'/>
                </EditModeMessage>
            );
        }
    }

    /*renderResetButton() {
        if (this.state.highlightedCasters.length !== 0) {

            return (
                <StyledButton onClick={() => this.setState({highlightedCasters: []})} label='Reset' />
            );
        }
    }*/

    renderTitleCasterLabels() {

        return this.state.highlightedCasters.map(caster => <CasterLabel key={caster} caster={caster}>{caster}</CasterLabel>);
    }

    render() {

        return (
            <>
                <Wrapper>
                    <Header>
                        <h1>
                            The Spells of D&D 5e
                        </h1>
                        <h3>
                            <ConicGradientMessage>Oh dang, it seems like your browser doesn't support conic gradients. This thing looks better with them. If you happen to have the latest Chrome or Safari, check this out in those instead!</ConicGradientMessage>
                            {this.renderEditUi()}
                        </h3>
                        <div>
                            <HighlightLabel>Highlight</HighlightLabel>
                            {casters.map(caster => <StyledButton
                                key={caster}
                                label={caster}
                                color={color[caster]}
                                filled={this.state.highlightedCasters.includes(caster)}
                                onClick={() => this.handleHighlightClick(caster)} />)}
                        </div>
                    </Header>
                    <BoardWrapper>
                        <Board>
                            {this.state.spells.map(i => <Spell
                                key={i.id}
                                id={i.id}
                                name={i.name}
                                casters={i.casters}
                                additionalCasters={i.additionalCasters}
                                additionalCastersShown={ this.state.highlightedCasters.length === 0 ? i.additionalCasters : []}
                                level={i.level}
                                selected={this.state.selectedId === i.id ? true : false}
                                hasOpacity={this.state.highlightedCasters.length === 0}
                                highlightColors={this.getHighlightColors(i.casters)}
                                coordinates={i.coordinates}
                                onClick={() => this.handleClick(i.id)}
                            />)}
                        </Board>
                    </BoardWrapper>
                    <Aside>
                        <h2>What is this thing?</h2>
                        <p>Ever wondered how big of an overlap there is between the spells of different casters in DnD? Do you want to know how similar the classes are? Do you like looking at trippy abstract modern art? Then this graphic is for you.</p>
                        <p>I took all 361 spells in the PHB, put them on a grid, colored them according to their caster classes, then meticulously arranged them by hand to form clusters as tight as possible.</p>
                        <p>If you enjoyed this, or found it useful, you can <a href='https://ko-fi.com/B0B511KTL'>buy me a coffee on Ko-Fi!</a></p>
                        <ColumnBreakerH2>Will you include spells from other sources (DMG, SCAG, XGE, AI)?</ColumnBreakerH2>
                        <p>Yeah! Maybe. It's, uh, a lot of work, so it will probably take time.</p>
                        <h2>How did you make this?</h2>
                        <p>I used <a href="https://www.reddit.com/r/DnD/comments/2qs89e/5e_spell_reference_sheets_are_done/">u/Zolo49's spell spreadsheet</a> as a resource, made a JSON file out of it, displayed them on a CSS grid, and used React to create an editing interface that I used to order the spells into these positions.</p>
                        <Logo>
                            <a href="http://github.com/dukeflipchart">
                                <img src={avatar} />
                            </a>
                        </Logo>
                        <CopyrightMessage>
                            This is unofficial, fan-created work. I am not affiliated with Wizards of the Coast in any way. Dungeons & Dragons, D&D, their respective logos, and all Wizards titles and characters are property of Wizards of the Coast LLC in the U.S.A. and other countries.
                        </CopyrightMessage>
                    </Aside>
                </Wrapper>
            </>
        );
    }
}

export default App;
