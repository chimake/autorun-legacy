import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from "assets/jss/material-kit-react/views/staticPages.js";
import Parallax from "components/Parallax/Parallax";
import { language } from 'config';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function PrivacyPolicy(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/header-back.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
 
        <div className={classes.container}>
            <br/>
            <h2 className={classes.title}>{language.privacy_policy}</h2>
            <p className={classes.description}>{language.privacy_policy_para1}</p>
            <p className={classes.description}>{language.privacy_policy_para2}</p>
            <p className={classes.description}>{language.privacy_policy_para3}</p>
            <p className={classes.description}>{language.privacy_policy_para4}</p>
            <p className={classes.description}>{language.privacy_policy_para5}</p>
            <p className={classes.description}>{language.privacy_policy_para6}</p>
            <p className={classes.description}>{language.privacy_policy_para7}</p>
            <br/>
        </div>
        </div>

      <Footer />
    </div>
  );
}
