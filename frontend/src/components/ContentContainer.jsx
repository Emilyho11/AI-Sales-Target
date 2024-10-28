import React from "react";
const ContentContainer = (props) => {
	return (
		<div className={`mx-4 lg:mx-28 mt-14 ${props.className}`}>
			{props.children}
		</div>
	);
};
export default ContentContainer;
