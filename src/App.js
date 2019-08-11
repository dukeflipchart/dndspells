import React from 'react';
import styled from 'styled-components';
import Spells from './spells';

const color = {
    bard: '#E052E0',
    cleric: '#EB4747',
    druid: '#60DF20',
    paladin: '#F5D63D',
    ranger: '#2EB82E',
    sorcerer: '#F2800D',
    warlock: '#A852FF',
    wizard: '#4C88FF'
}

// start json import

const casterTypes = ['Bard', 'Ranger', 'Druid', 'Cleric', 'Paladin', 'Warlock', 'Sorcerer', 'Wizard'];

var coordX = 1;
var coordY = 1;

for (var currentKey in Spells) {

    Spells[currentKey]['id'] = currentKey;
    Spells[currentKey]['casters'] = [];
    Spells[currentKey]['additionalCasters'] = [];
    Spells[currentKey]['coordinates'] = [coordX, coordY];
    if (++coordX > 19) {
        coordX = 1;
        coordY++;
    }

    for (var casterType of casterTypes) {
        if (Spells[currentKey]['caster' + casterType] === casterType) {
            Spells[currentKey]['casters'].push(casterType.toLowerCase());
        } else if (Spells[currentKey]['caster' + casterType]) {
            Spells[currentKey]['additionalCasters'].push(casterType.toLowerCase());
        }
    }

    //console.log(Spells[currentKey]);
}

// end json import

function Gradientize(casters) {
    let gradient = 'background: conic-gradient(';
    let position = 0;
    let step = 100/casters.length;
    for (let caster of casters) {
        if (position) {
            gradient += ', ';
        }
        gradient += color[caster] + ' ' + position + '% ' + (position += step) + '%';
    }
    gradient += ');';
    return gradient;
}

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.75vw;
    margin: 0.75vw;
    max-height: 100%;
`;

function AdditionalCaster(props) {

    return (
        <div className={props.className}></div>
    );
}

const StyledAdditionalCaster = styled(AdditionalCaster)`
    position: absolute;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    background-color: ${props => color[props.caster]};

    :first-of-type {
        top: 0;
        left: 0;
    }

    :nth-of-type(2) {
        top: 0;
        right: 0;
    }
`;

function Spell(props) {

    function renderAdditionalCasters(props) {
        if (props.additionalCasters) {

            return props.additionalCasters.map(additionalCaster => <StyledAdditionalCaster caster={additionalCaster}/>);
        }

        else return '';
    }

    return (
        <div className={props.className} onClick={() => props.onClick()}>
            {renderAdditionalCasters(props)}
            <SpellLevel>{props.id}</SpellLevel>
        </div>
    );
}

const StyledSpell = styled(Spell)`
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
    ${props => Gradientize(props.casters)}
    ${props => props.coordinates ? 'grid-column-start: ' + props.coordinates[0] + ';' : ''}
    ${props => props.coordinates ? 'grid-row-start: ' + props.coordinates[1] + ';' : ''}
    position: relative;
    ${props => props.selected ? 'box-shadow: 0 0 0 3px #fff;' : 'box-shadow: 0 0 1vw 0 #000;'}
    ${props => props.selected ? 'z-index: 2;' : ''}
    cursor: pointer;

    :hover {
        ${props => props.selected ? 'box-shadow: 0 0 0 3px #fff;' : 'box-shadow: 0 0 0 3px rgba(255,255,255,0.5);'}
        z-index: 2;
    }
`;

const SpellLevel = styled.div`
    position: absolute;
    top: calc(50% - 0.75vw);
    left: 0;
    right: 0;
    font-size: 1.5vw;
    line-height: 1.5vw;
    text-align: center;
`;

function SaveButton(props) {

}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false
        };

        for (var currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            //console.log(this.state.spells[currentKey]);
        }

        this.state.selectedId = false;
    }

    renderSpell(spellId) {
        //console.log(this.state.spells[spellId]['name']);

        return (<StyledSpell
            id={spellId}
            casters={this.state.spells[spellId]['casters']}
            additionalCasters={this.state.spells[spellId]['additionalCasters']}
            level={this.state.spells[spellId]['level']}
            selected={this.state.selectedId === spellId ? true : false}
            coordinates={this.state.spells[spellId]['coordinates']}
            onClick={() => this.handleClick(spellId)}
        />);
    }

    handleClick(spellId) {
        if (this.state.selectedId === spellId) {
            this.setState({'selectedId': false});
            console.log('unselected: '+spellId);
        } else if (this.state.selectedId) {
            console.log('switching position of ' + this.state.selectedId + ' and ' + spellId);
            var newCoords = this.state.spells[spellId]['coordinates'];
            this.state.spells[spellId]['coordinates'] = this.state.spells[this.state.selectedId]['coordinates'];
            this.state.spells[this.state.selectedId]['coordinates'] = newCoords;
            this.setState({'selectedId': false});
        } else {
            this.setState({'selectedId': spellId});
            console.log('selected: '+spellId);
        }
    }

    renderSpells() {
        var spells = [];

        for (var currentSpellId in this.state.spells) {
            spells.push(this.renderSpell(currentSpellId));
            //console.log(currentSpellId);
        }

        return spells;
    }

    render() {
        return (
            <Board>
                {this.renderSpells()}
            </Board>
        );
    }
}

export default App;
