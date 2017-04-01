import NavPanel from '../../components/NavPanel';

const UserAccountLayout = (props) => {
	return(
		<section className="container m-padding-default">
      <div className="row">
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
          <div className="m-margin-bottom_small">
            <a className="btn btn-lg btn-info" href="upload">Добавить фото</a>
          </div>
          <NavPanel path={props.path} />
        </div>
        <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        	{props.children}
        </div>
      </div>
    </section>
  	)
}


UserAccountLayout.propTypes = {
  path: React.PropTypes.string.isRequired,
};

export default UserAccountLayout