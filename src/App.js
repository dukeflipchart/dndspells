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

const casterTypes = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];

for (var currentKey in Spells) {
    console.log(Spells[currentKey]);
    Spells[currentKey]['id'] = currentKey;
    Spells[currentKey]['casters'] = [];
    Spells[currentKey]['additionalCasters'] = [];
    for (var casterType of casterTypes) {
        if (Spells[currentKey]['caster' + casterType] === casterType) {
            Spells[currentKey]['casters'].push(casterType.toLowerCase());
        } else if (Spells[currentKey]['caster' + casterType]) {
            Spells[currentKey]['additionalCasters'].push(casterType.toLowerCase());
        }
    }
}

console.log(Spells);

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
        <div className={props.className}>
            {renderAdditionalCasters(props)}
            <SpellLevel>{props.level}</SpellLevel>
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
    box-shadow: 0 0 2vw 0 #000;
    position: relative;
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

class App extends React.Component {

    state = {
    };

    renderSpells() {
        var spellList = [];
        for (var currentKey in Spells) {
            //console.log(Spells[currentKey]['additionalCasters']);
            spellList.push(<StyledSpell
                casters={Spells[currentKey]['casters']}
                additionalCasters={Spells[currentKey]['additionalCasters']}
                level={Spells[currentKey]['level']}
            />);
        }

        return spellList;
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
