import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { UserType } from "src/types";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function ProfileLikes(props) {
	const userData: User = props.userData;

	return (
		<>
			<Head>
				<title>
					{!!userData.loading
						? "Profile / Twitter"
						: `Likes ${userData.name} (@${userData.tag_name}) / Twitter`}
				</title>
			</Head>
			<SpinnerLoader loading={true} center />
			<div style={{ minHeight: "200vh" }} />
		</>
	);
}
