import React from 'react';
import styled from 'styled-components';
import { color, Spell, StyledSpell, CasterLabel } from './spell';
import Spells from './spells';

function SaveButton(props) {

    return <button onClick={() => props.onClick()}>Save</button>;
}

function HighlightButton(props) {

    return <button onClick={() => props.onClick()}>{props.label}</button>;
}

function swap(spells, i1, i2) {

    return spells.map((spell, index) => {
        switch (index) {
            case i1: return {...spell, coordinates: spells[i2].coordinates};
            case i2: return {...spell, coordinates: spells[i1].coordinates};
            default: return spell;
        }
    });
}

const Wrapper = styled.div`
    font-size: 12px;
`;

const Header = styled.header`
    padding: 1em;
    text-transform: uppercase;
    text-align: center;

    ${CasterLabel} {
        text-transform: uppercase;

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

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.75vw;
    margin: 0.75vw;
    @media only screen and (min-width: 1280px) {
        width: calc(1280px - 1.5 * 12.8px);
        grid-gap: calc(0.75 * 12.8px);
    }
`;

const Aside = styled.aside``;

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
            if (this.state.highlightedCasters === this.state.spells[i].casters) {
                this.setState({highlightedCasters: []});
            } else {
                this.setState({highlightedCasters: this.state.spells[i].casters});
            }
        }
    }

    handleHighlightClick(caster) {
        if (this.state.highlightedCasters.includes(caster)) {
            /* if the caster was highlighted, we remove it from the highlighted classes */
            //console.log('removing highlight from ' + caster);
            this.setState({
                highlightedCasters: this.state.highlightedCasters.filter(value =>  value !== caster)
            });
        } else {
            /* if the caster was not highlighted, we add it to highlighted classes */
            //console.log('highlighting ' + caster);
            var newhighlightedCasters = this.state.highlightedCasters;
            newhighlightedCasters.push(caster);
            this.setState({
                highlightedCasters: newhighlightedCasters
            });
        }
    }

    getHighlightColors(casters) {

        return casters.filter(value => this.state.highlightedCasters.includes(value));
    }

    renderSpells() {

        return this.state.spells.map(i => <Spell
            key={i.id}
            id={i.id}
            name={i.name}
            casters={i.casters}
            additionalCasters={this.state.highlightedCasters.length === 0 ? i.additionalCasters : []}
            level={i.level}
            selected={this.state.selectedId === i.id ? true : false}
            hasOpacity={this.state.highlightedCasters.length === 0}
            highlightColors={this.getHighlightColors(i.casters)}
            coordinates={i.coordinates}
            onClick={() => this.handleClick(i.id)}
        />);
    }

    renderButtons() {
        if (this.state.editMode) {

            return (
                <>
                    <p>EDIT MODE, AUTOSAVING</p>
                    <SaveButton onClick={() => this.handleSave(this.state.spells)} />
                    <HighlightButton onClick={() => this.handleHighlightClick('bard')} label='Highlight Bard' />
                    <HighlightButton onClick={() => this.handleHighlightClick('cleric')} label='Highlight Cleric' />
                    <HighlightButton onClick={() => this.handleHighlightClick('druid')} label='Highlight Druid' />
                    <HighlightButton onClick={() => this.handleHighlightClick('paladin')} label='Highlight Paladin' />
                    <HighlightButton onClick={() => this.handleHighlightClick('ranger')} label='Highlight Ranger' />
                    <HighlightButton onClick={() => this.handleHighlightClick('sorcerer')} label='Highlight Sorcerer' />
                    <HighlightButton onClick={() => this.handleHighlightClick('warlock')} label='Highlight Warlock' />
                    <HighlightButton onClick={() => this.handleHighlightClick('wizard')} label='Highlight Wizard' />
                </>
            );
        }
    }

    renderTitleCasterLabels() {

        return this.state.highlightedCasters.map(caster => <CasterLabel key={caster} caster={caster}>{caster}</CasterLabel>);
    }

    render() {

        return (
            <>
                <Wrapper>
                    <Header>
                        {this.state.highlightedCasters.length === 0 ? 'Spells of D&D 5e' : 'Spells known by '}
                        {this.renderTitleCasterLabels()}
                    </Header>
                    <Board>
                        {this.renderSpells()}
                    </Board>
                    <Aside>
                        {this.renderButtons()}
                    </Aside>
                </Wrapper>
            </>
        );
    }
}

export default App;
