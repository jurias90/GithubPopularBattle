import React from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api.js";
import {
	FaUser,
	FaStar,
	FaCodeBranch,
	FaExclamationTriangle,
	FaCode,
} from "react-icons/fa";

import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

function LanguagesNav({ selected, onUpdateLang }) {
	const languages = ["All", "Javascript", "Ruby", "Java", "CSS", "Python"];
	return (
		<ul className="flex-center">
			{languages.map((language, id) => (
				<li key={language}>
					<button
						className="btn-clear nav-link"
						style={language === selected ? { color: "rgb(187, 46, 31)" } : null}
						onClick={() => onUpdateLang(language)}
					>
						{language}
					</button>
				</li>
			))}
		</ul>
	);
}

LanguagesNav.propTypes = {
	selected: PropTypes.string.isRequired,
	onUpdateLang: PropTypes.func.isRequired,
};

function ReposGrid({ repos }) {
	return (
		<ul className="grid space-around">
			{repos.map((repo, index) => {
				const {
					name,
					owner,
					html_url,
					stargazers_count,
					forks,
					open_issues,
				} = repo;
				const { login, avatar_url } = owner;

				return (
					<li key={html_url}>
						<Card
							header={`#${index + 1}`}
							avatar={avatar_url}
							href={html_url}
							name={login}
						>
							<ul className="card-list">
								<li>
									<Tooltip text="Github Username">
										<FaUser color="rgb(255,191, 116)" size={22} />
										<a href={`https://github.com/${login}`}>{login}</a>
									</Tooltip>
								</li>
								<li>
									<FaStar color="rgb(255,215, 0)" size={22} />
									{stargazers_count.toLocaleString()} Stars
								</li>
								<li>
									<FaCodeBranch color="rgb(129,195,45)" size={22} />
									{forks.toLocaleString()} Forks
								</li>
								<li>
									<FaExclamationTriangle color="rgb(241,138, 147)" size={22} />
									{open_issues.toLocaleString()} Open Issues
								</li>
							</ul>
						</Card>
					</li>
				);
			})}
		</ul>
	);
}

ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired,
};

class Popular extends React.Component {

	state = {
		selectedLang: "All",
		repos: {},
		error: null
	}


	componentDidMount() {
		this.updateLanguage(this.state.selectedLang);
	}

	updateLanguage = (selectedLang) => {
		this.setState({
			selectedLang,
			error: null,
		});
		if (!this.state.repos[selectedLang]) {
			fetchPopularRepos(selectedLang).then((data) => {
				this.setState(({ repos }) => ({
					repos: {
						...repos,
						[selectedLang]: data,
					},
				}))
			}).catch(() => {
				console.warn("Error Fetching Repos:", error);

				this.setState({
					error: "There was an error fetching the repos",
				});
			});;
		}
	}

	isLoading = () => {
		const { selectedLang, repos, error } = this.state;

		return !repos[selectedLang] && error === null;
	}

	render() {
		const { selectedLang, repos, error } = this.state;

		return (
			<React.Fragment>
				<LanguagesNav
					selected={selectedLang}
					onUpdateLang={this.updateLanguage}
				/>

				{this.isLoading() && <Loading text="Fetching Repos" />}

				{error && <p className="center-text error">{error}</p>}

				{repos[selectedLang] && <ReposGrid repos={repos[selectedLang]} />}
			</React.Fragment>
		);
	}
}

export default Popular;
