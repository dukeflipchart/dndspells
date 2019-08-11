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

/* Parsing a Google Sheets JSON */

/*const casterTypes = ['Bard', 'Ranger', 'Druid', 'Cleric', 'Paladin', 'Warlock', 'Sorcerer', 'Wizard'];

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
}*/

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
    @media only screen and (min-width: 1280px) {
        width: calc(1280px - 1.5 * 12.8px);
        grid-gap: calc(0.75 * 12.8px);
        margin: calc(0.75 * 12.8px) auto;
    }
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

    @media only screen and (min-width: 1280px) {
        width: 12.8px;
        height: 12.8px;
    }
`;

function Spell(props) {

    function renderAdditionalCasters(props) {
        if (props.additionalCasters) {

            return props.additionalCasters.map(additionalCaster => <StyledAdditionalCaster caster={additionalCaster}/>);
        } else {

            return '';
        }
    }

    return (
        <div className={props.className} onClick={() => props.onClick()}>
            {renderAdditionalCasters(props)}
            <SpellLevel>{props.selected ? 'SEL' : '' }</SpellLevel>
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
    box-shadow:
        0 0 1vw 0 #000
        ${props => props.selected ? ', 0 0 0 3px #fff' : ''}
        ${props => props.highlighted ? ', 0 0 1vw 3px ' + color[props.casters[0]] : ''};
    ${props => props.selected ? 'z-index: 2;' : ''}
    cursor: pointer;
    ${props => props.highlighted ? 'background-color: black !important;' : ''}

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

    @media only screen and (min-width: 1280px) {
        top: calc(50% - 0.75 * 12.8px);
        font-size: calc(1.5 * 12.8px);
        line-height: calc(1.5 * 12.8px);
    }
`;

function SaveButton(props) {

    return <button onClick={() => props.onClick()}>Save</button>;
}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false,
            'highlightedIds': ['0', '1', '2', '3', '4', '5'],
            'timeSinceLastSave': 0
        };

        var currentKey=0;
        for (currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            console.log(this.state.spells[currentKey]);
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
        this.setState({
            'timeSinceLastSave': this.state['timeSinceLastSave'] + 1000
        });
        if (this.state['timeSinceLastSave'] > 300000) {
            this.handleSave(this.state.spells);
            this.setState({
                'timeSinceLastSave': 0
            });
            console.log('Saved');
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

    renderSpell(i) {
        //console.log(this.state.highlightedIds);
        //console.log(this.state.highlightedIds.includes(this.state.spells[i]['id']) ? ' contains ' : 'does not contain ')
        //console.log(this.state.spells[i]['id']);

        return (<StyledSpell
            id={this.state.spells[i]['id']}
            casters={this.state.spells[i]['casters']}
            additionalCasters={this.state.spells[i]['additionalCasters']}
            level={this.state.spells[i]['level']}
            selected={this.state.selectedId === i ? true : false}
            highlighted={this.state.highlightedIds.includes(this.state.spells[i]['id']) ? true : false}
            coordinates={this.state.spells[i]['coordinates']}
            onClick={() => this.handleClick(i)}
        />);
    }

    handleClick(i) {
        if (this.state.selectedId === i) {
            this.setState({'selectedId': false});
            console.log('unselected: '+i);
        } else if (this.state.selectedId) {
            console.log('switching position of ' + this.state.selectedId + ' and ' + i);
            var newCoords = this.state.spells[i]['coordinates'];
            this.state.spells[i]['coordinates'] = this.state.spells[this.state.selectedId]['coordinates'];
            this.state.spells[this.state.selectedId]['coordinates'] = newCoords;
            this.setState({'selectedId': false});
        } else {
            this.setState({'selectedId': i});
            console.log('selected: ' + i);
        }
    }

    renderSpells() {
        var spells = [];

        for (var i in this.state.spells) {
            spells.push(this.renderSpell(i));
            //console.log(i);
        }

        return spells;
    }

    render() {
        return (
            <>
                <Board>
                    {this.renderSpells()}
                </Board>
                <SaveButton onClick={() => this.handleSave(this.state.spells)} />
            </>
        );
    }
}

export default App;
