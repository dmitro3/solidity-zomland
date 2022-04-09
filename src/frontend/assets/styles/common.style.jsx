import styled from "styled-components";
import innerBg from "../images/body-bg2.webp";
import innerTopBg from "../images/breadcrumbs-bg.webp";
import { Link as ReactLink, NavLink as ReactNavLink } from "react-router-dom";
import * as Scroll from "react-scroll";
import { keyframes } from "styled-components";

export const Wrapper = styled.section.attrs({
  className: `
  relative
  mb-auto`,
})``;

export const InnerPageWrapper = styled.section.attrs({
  className: `
  flex 
  flex-col 
  min-h-screen 
  justify-between`,
})`
  background: url(${innerBg}) repeat-y top/cover;
  &:before {
    content: "";
    display: block;
    z-index: 0;
    background: url(${innerTopBg}) no-repeat bottom/cover;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 400px;
  }
`;

export const Container = styled.div.attrs({
  className: `
    px-2
    z-10
    xl:px-10
    mx-auto
    container`,
})``;

export const Link = styled(ReactLink).attrs((props) => ({
  className: `
    text-current
    transition
    ease-in-out
    duration-200
    ${props.size ? "text-" + props.size : "text-base"}
    ${props.font ? "font-" + props.font : "font-semibold"}
    `,
}))``;

export const NavLink = styled(ReactNavLink).attrs({
  className: `
    px-2.5
    py-2.5
    xl:px-4
    lg:ml-0.5
    2xl:ml-1
    font-semibold
    transition
    ease-in-out
    duration-200
    rounded-xl
    hover:text-purple-600
    cursor-pointer`,
})``;

export const ScrollLink = styled(Scroll.Link).attrs({
  className: `
    px-4
    py-3
    ml-1
    font-semibold
    transition
    ease-in-out
    duration-200
    rounded-xl
    hover:text-purple-600
    cursor-pointer`,
})``;

const ZoomInOut = keyframes`
 0% { transform: scale(1, 1) }
 20% { transform: scale(1.05, 1.1) }
 50% { transform: scale(1, 1) }
 100% { transform: scale(1, 1) }
`;

export const Btn = styled.button`
  animation: ${(props) => props.animated && ZoomInOut} 2s ease 3s infinite;
  &:hover {
    animation: none;
  }
`;

export const Row = styled.div.attrs({
  className: `
    flex
    flex-row
    items-center`,
})``;

export const Col = styled.div.attrs({
  className: `
    flex
    flex-col`,
})``;

export const ListWrapper = styled.div.attrs({
  className: `mt-16 w-full`,
})``;

export const List = styled.div.attrs({
  className: `flex items-center justify-center w-full flex-wrap gap-8`,
})``;
