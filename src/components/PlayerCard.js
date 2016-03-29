import React, { Component, PropTypes } from 'react';

export default class PlayerCard extends Component {
  static propTypes = {
    player: PropTypes.object
  };

  render() {
    const player = this.props.player;
    let imgsrc;
    if (player.specialImages && player.specialImages.largeTOTWImgUrl) {
      imgsrc = player.specialImages.largeTOTWImgUrl;
    } else {
      imgsrc = player.headshot.largeImgUrl;
    }
    const cardStyle = `ut-item ut-item--big ut-item--big-bg-${player.color} ut-item--player`;
    return (
      <div className={cardStyle}>
        <div className="ut-item_meta">
          <span className="ut-item_stat ut-item_stat--num ut-item_rating">{player.rating}</span>
          <span className="ut-item_stat ut-item_stat--label ut-item_position">{player.position}</span>
          <img alt="Item crest" className="ut-item_crest" src={player.club.imageUrls.normal.large} />
          <img alt="Item flag" className="ut-item_flag" src={player.nation.imageUrls.large} />
        </div>
        <img alt="Item Headshot" className="ut-item_headshot" src={imgsrc} />
        <h2 className="ut-item_heading ut-item_heading--main">{player.name.toUpperCase()}</h2>
        <div className="ut-item_view ut-item_view0 ut-item_view--summary">
          <table className="ut-item_attr-data">
            <tbody>
              <tr className="ut-item_attr-data-row">
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[0].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[0].name.replace(/fut\.attribute\./, '')}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[3].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[3].name.replace(/fut\.attribute\./, '')}
                </td>
              </tr>
              <tr className="ut-item_attr-data-row">
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[1].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[1].name.replace(/fut\.attribute\./, '')}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[4].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[4].name.replace(/fut\.attribute\./, '')}
                </td>
              </tr>
              <tr className="ut-item_attr-data-row">
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[2].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[2].name.replace(/fut\.attribute\./, '')}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--num">
                  {player.attributes[5].value}
                </td>
                <td className="ut-item_attr-data-cell ut-item_stat ut-item_attr-data-cell ut-item_stat--label">
                  {player.attributes[5].name.replace(/fut\.attribute\./, '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
