import React from "react";
import ModelComponent from "../Common/Component/ModelComponent";

const ModulesModal = ({ openModules, toggler, children }) => {
  return (
    <ModelComponent
      children={children}
      isOpen={openModules}
      size={"sm"}
      closeBtnText={"Close"}
      toggler={toggler}
      title={"Modules"}
    />
  );
};

export default ModulesModal;
