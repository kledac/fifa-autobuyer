import React, { PropTypes, Component } from 'react';
import PlayerCard from './PlayerCard';

class PlayerDetailTable extends Component {
  render() {
    const { player } = this.props;
    /* eslint-disable max-len */
    return (
      <div>
        <div className="ut-body-inner">
          <div className="ut-bio-details ut-bio-details--no-prices">
            <div className="ut-bio-details_group">
              <div className="ut-item-container">
                <div className="ut-item-container_header">
                  <PlayerCard player={player} />
                </div>
              </div>
            </div>
            <div className="ut-bio-details_group">
              <div className="ut-bio-details_headings">
                <h2 className="ut-bio-details_header--player-name">{player.firstName} {player.lastName}</h2>
                <h3 className="ut-bio-details_header--item-type">Rare Gold</h3>
              </div>

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
                      <td className="ut-bio-stats_data-value">174</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type">weight</th>
                      <td className="ut-bio-stats_data-value">65</td>
                    </tr>
                  </tbody>
                </table>
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
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">74</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" widthPercent="74" width="74%" />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
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
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
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
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="ut-bio-stats_item ut-grid-view_item">
              <div className="ut-bio-stats_header">
                <h6 className="ut-bio-stats_title">
                  <span className="ut-bio-stats_title-type ng-binding">pace</span>
                  <span className="ut-bio-stats_title-value ut-bio-stats_title-value--good">74</span>
                </h6>
                <svg className="ut-bio-stats_graph">
                  <rect className="ut-bio-stats_graph-bar ut-bio-stats_graph-bar--good" height="100%" widthPercent="74" width="74%" />
                </svg>
              </div>
              <div className="ut-bio-stats_content">
                <table className="ut-bio-stats_data">
                  <tbody>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
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
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
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
                      <th className="ut-bio-stats_data-type ng-binding">acceleration</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">77</td>
                    </tr>
                    <tr className="ut-bio-stats_data-row">
                      <th className="ut-bio-stats_data-type ng-binding">sprint speed</th>
                      <td className="ut-bio-stats_data-value ut-bio-stats_data-value--good">71</td>
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
