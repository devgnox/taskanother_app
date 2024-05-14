import React from "react";

interface IListWrapperProps {
  children: React.ReactNode;
}

const ListWrapper = ({ children }: IListWrapperProps) => {
  return <li className="shrink-0 h-full w-[272px] select-none">{children}</li>;
};

export default ListWrapper;
