
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faCog, faTable, faTimes, faCashRegister,faBars } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";

import "../css/Sidebar.css"

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const location = useLocation(); // React Router'dan useLocation hook'u kullanıyoruz
    const { pathname } = location;
  
    const navItemClassName = link === pathname ? "active nav-item my-2" : "nav-item my-2";
    const linkProps = external ? { href: link } : { as: Link, to: link };
  
    return (
      <Nav.Item className={navItemClassName}>
        <Nav.Link {...linkProps} target={target}>
          {icon && <FontAwesomeIcon icon={icon} className="sidebar-icon" style={{ color: "#1a1a1a" }}/>}
          <span>{title}</span>
          {badgeText && <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>}
        </Nav.Link>
      </Nav.Item>
    );
  };
  
  const NavItemTop = (props) => {
    const { title, image } = props;

    return (
      <Nav.Item onClick={() => setShow(false)}>
        <span style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Image src={image} width={60} height={60} className="sidebar-icon svg-icon" />
          <p style={{ color: "#1a1a1a", fontWeight: 'bold', fontSize: '23px', marginTop: '17px' }}>{title}</p>
        </span>
      </Nav.Item>
    );
  };

  return (
    < >
      <Navbar expand={false} collapseOnSelect variant="light" className="px-4 d-md-none" style={{ backgroundColor: "#eeeeee" }}>
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.Dashboard.path}>
          <Image src={'https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f'} className="nav-item" alt="Leras Logo" style={{ width: '50px', height: '50px' }}/>
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse} style={{ borderColor: "#1a1a1a" }}>
          <FontAwesomeIcon icon={faBars} style={{ color: "#1a1a1a" }}/>
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block text-black`} style={{ backgroundColor: "#eeeeee" }}>
          <div className="sidebar-inner px-4 pt-3 mt-4">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItemTop title="Leras Coffee" image={'https://firebasestorage.googleapis.com/v0/b/lib-18147.appspot.com/o/images%2FLeras-logo.png?alt=media&token=57f65473-2f3a-45cb-b207-d00cb4ed574f'} link={""} />

              <Dropdown.Divider style={{ borderColor: "#1a1a1a", marginBottom: '20px' }} />

              <NavItem title="Anasayfa" link={Routes.Dashboard.path} icon={faTable} />
              <NavItem title="Kasa" icon={faCashRegister} link={Routes.Transactions.path} />
              <NavItem title="Menü 1" icon={faChartPie} link={Routes.Menu.path} />
              <NavItem title="Menü 2" icon={faChartPie} link={Routes.Menu2.path} />
              <NavItem title="Menü 3" icon={faChartPie} link={Routes.Menu3.path} />
              <NavItem title="Barista" icon={faChartPie} link={Routes.Barista.path} />
              <NavItem title="Ayarlar" icon={faCog} link={Routes.Settings.path} />

              <Dropdown.Divider className="my-2" style={{ borderColor: "#1a1a1a" }} />

              {/*<Button as={Link} to={Routes.Menu.path} variant="secondary" className="upgrade-to-pro"><FontAwesomeIcon icon={faRocket} className="me-1" /> Upgrade to Pro</Button>*/}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
