import React, { Fragment, useContext } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import H3 from "../Headings/H3Element";
import CustomizerContext from "../../_helper/Customizer";
import SvgIcon from "../../Components/Common/Component/SvgIcon";
import { PlusSquare } from "react-feather";
import { FaPlusSquare } from "react-icons/fa";

const Breadcrumbs = ({ mainTitle, buttonTitle, onClick, btnColor }) => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <Fragment>
      <Container fluid={true}>
        <div className="page-title">
          <Row>
            <Col xs="6">
              <H3>{mainTitle}</H3>
            </Col>
            <Col xs="6" className="text-end align-items-center">
              {buttonTitle && (
                <Button color={btnColor || 'primary'} onClick={onClick}>
                  {buttonTitle}
                </Button>
              )}
            </Col>
            {/* <Col xs='6'>
              <ol className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link to={`/dashboard/default/${layoutURL}`}>
                    <SvgIcon iconId='stroke-home' />
                  </Link>
                </li>
                <li className='breadcrumb-item'>{props.parent}</li>
                {props.subParent ? <li className='breadcrumb-item'>{props.subParent}</li> : ''}
                <li className='breadcrumb-item active'>{props.title}</li>
              </ol>
            </Col> */}
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default Breadcrumbs;
