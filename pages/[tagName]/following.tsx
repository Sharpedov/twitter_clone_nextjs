import React from "react";
import Head from "next/head";
import styled from "styled-components";
import SpinnerLoader from "src/components/loaders/spinnerLoader";
import { UserType } from "src/types";

interface User extends UserType {
	loading: boolean;
	error: any;
}

export default function ProfileFollowing(props) {
	const userData: User = props.userData;

	return (
		<>
			<Head>
				<title>Following</title>
			</Head>
			<SpinnerLoader loading={true} center />
			<div style={{ minHeight: "200vh" }} />
		</>
	);
}
