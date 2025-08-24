import React, { useState } from "react";
import {
  Breadcrumbs,
  P,
  Image,
  H4,
  H5,
  H6,
  Btn,
  UL,
  LI,
} from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserProfileCard = () => {
  const [togglePwd, setTogglePwd] = useState(false);
  const [currentpwd, setCurrentpwd] = useState("");
  const [newpwd, setNewpwd] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const { userDetails } = useSelector((state) => state.auth);
  console.log(userDetails);

  const resetForm = () => {
    setCurrentpwd("");
    setNewpwd("");
    setConfirmpwd("");
  };
  const updatePassword = (e) => {
    e.preventDefault();
    console.log(currentpwd, "\n", newpwd, "\n", confirmpwd);
    resetForm();
    toast.success("Password is updated!");
    setTogglePwd(false);
  };

  return (
    <>
      <Breadcrumbs mainTitle={"My Profile"} />

      <Container fluid={true}>
        <Row>
          <Col md="6">
            <Card>
              <CardBody>
                <UL>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-2",
                    }}
                  >
                    <H6>Name</H6>
                    <span>{userDetails.userName}</span>
                  </LI>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-2",
                    }}
                  >
                    <H6>Contact No.</H6>
                    <span>{userDetails.mobile}</span>
                  </LI>
                  <LI
                    attrLI={{
                      className: "d-flex justify-content-between mb-4",
                    }}
                  >
                    <H6>Email Address</H6>
                    <span>{userDetails.email}</span>
                  </LI>
                  <LI attrLI={{ className: "d-flex justify-content-center" }}>
                    <Button
                      color="light"
                      onClick={() => setTogglePwd(!togglePwd)}
                    >
                      Change Password
                    </Button>
                  </LI>
                </UL>
              </CardBody>
            </Card>
          </Col>
          {togglePwd && (
            <Col md="6">
              <Card>
                <CardBody>
                  <Form onSubmit={updatePassword}>
                    <FormGroup>
                      <Label>Current Password</Label>
                      <Input
                        type="text"
                        name="currentpwd"
                        value={currentpwd}
                        placeholder="Enter current password"
                        onChange={(e) => setCurrentpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>New Password</Label>
                      <Input
                        type="text"
                        name="newpwd"
                        value={newpwd}
                        placeholder="Enter new password"
                        onChange={(e) => setNewpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Confirm Password</Label>
                      <Input
                        type="text"
                        name="confirmpwd"
                        value={confirmpwd}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpwd(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={!(currentpwd && newpwd && confirmpwd)}
                      >
                        Update
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        type="reset"
                        disabled={!(currentpwd || newpwd || confirmpwd)}
                        onClick={resetForm}
                      >
                        Reset
                      </Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default UserProfileCard;
