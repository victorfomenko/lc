import ParamLink from '../../components/paramLink';

const UserAbout = (props) => {
  const { name, website, url, showEditButton } = props;
  let { avatar, about } = props;

  about = about ? about : 'Автор ничего не написал о себе ;(';
  avatar = avatar ? avatar : 'noavatar.jpg';

  return (
    <div className="row">
      <div className="col-xs-6 col-sm-2 col-md-3 col-lg-2 m-text_center">
        <img className="artist__avatar user-avatar" src={avatar}
             alt={name}
             title={name}/>
        {
          showEditButton && (
            <ParamLink url='/account' params={{url}}>
              <a className="btn btn-info btn-sm">Редактировать</a>
            </ParamLink>
          )
        }
      </div>
      <div className="col-xs-6 col-sm-10 col-md-9 col-lg-10">
        <h1 className="artist__header">{name}</h1>
        <span className="artist__about">{about}</span>
        {
          website && (
            <div className="artist__link">
              <a target="_blank" href={website}>{website}</a>
            </div>
          )
        }
      </div>
    </div>
  );
}

UserAbout.propTypes = {
  avatar: React.PropTypes.string,
  about: React.PropTypes.string,
  name: React.PropTypes.string,
  website: React.PropTypes.string,
  url: React.PropTypes.string,
  showEditButton: React.PropTypes.bool,
};

export default UserAbout