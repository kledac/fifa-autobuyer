import React, { PropTypes, Component } from 'react';
import PlayerCard from './PlayerCard';

class PlayerDetailTable extends Component {
  render() {
    const { player } = this.props;
    let playerName;
    if (player.commonName) {
      playerName = player.commonName;
    } else {
      playerName = `${player.firstName} ${player.lastName}`;
    }
    /* eslint-disable max-len */
    return (
      <div className="ut-bio ut-underlay">
        <div className="ut-body-inner">
          <div className="ut-bio-details ut-bio-details--no-prices">
            <div className="ut-bio-details_group">
              <div className="ut-item-container">
                <div className="ut-item-container_header">
                  <PlayerCard player={player} />
                </div>
              </div>
              <svg className="ut-icon ut-polygons-bio">
                <use xlinkHref="https://www.easports.com/fifa/ultimate-team/fut/database/player/177003/Modri%C4%87#ut-polygons-bio" className="ut-icon_symbol" />
              </svg>
            </div>
            <div className="ut-bio-details_group">
              <div className="ut-bio-details_headings">
                <h2 className="ut-bio-details_header--player-name">{playerName}</h2>
                <h3 className="ut-bio-details_header--item-type">{player.price && player.price.lowest}</h3>
              </div>
              <div className="ut-bio-details_stats ut-grid-view">
                <div className="ut-grid-view_item">
                  <table className="ut-bio-stats_data">
                    <tbody>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">overall</th>
                        <td className="ut-bio-stats_data-value">{player.rating}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">club</th>
                        <td className="ut-bio-stats_data-value">{player.club.name}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">league</th>
                        <td className="ut-bio-stats_data-value">{player.league.name}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">nation</th>
                        <td className="ut-bio-stats_data-value">{player.nation.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="ut-grid-view_item clear">
                  <table className="ut-bio-stats_data">
                    <tbody>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">position</th>
                        <td className="ut-bio-stats_data-value">{player.positionFull}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">age</th>
                        <td className="ut-bio-stats_data-value">{player.age}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">height</th>
                        <td className="ut-bio-stats_data-value">{player.height}</td>
                      </tr>
                      <tr className="ut-bio-stats_data-row">
                        <th className="ut-bio-stats_data-type">weight</th>
                        <td className="ut-bio-stats_data-value">{player.weight}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ut-body-inner ut-body-inner--fixed">
          <div className="ut-bio-stats ut-grid-view">
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">pace</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[0].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[0].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.acceleration}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.sprintspeed}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">dribbling</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[3].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[3].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">agility</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.agility}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">balance</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.balance}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">ball control</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.ballcontrol}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">dribbling</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.dribbling}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">shooting</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[1].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[1].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">positioning</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.positioning}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">finishing</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.finishing}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">shot power</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.shotpower}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">long shots</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.longshots}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">volleys</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.volleys}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">penalties</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.penalties}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">defending</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[4].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[4].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">interceptions</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.interceptions}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">heading accuracy</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.headingaccuracy}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">marking</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.marking}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">standing tackle</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.standingtackle}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sliding tackle</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.slidingtackle}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">passing</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[2].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[2].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">vision</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.vision}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">crossing</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.crossing}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">free kick accuracy</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.freekickaccuracy}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">short passing</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.shortpassing}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">long passing</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.longpassing}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">curve</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.curve}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">physicality</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">{player.attributes[5].value}</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" width={`${player.attributes[5].value}%`} />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">jumping</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.jumping}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">stamina</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.stamina}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">strength</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.strength}</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">aggression</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">{player.aggression}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    /* eslint-enable max-len */
  }
}

PlayerDetailTable.propTypes = {
  player: PropTypes.shape({})
};

export default PlayerDetailTable;
