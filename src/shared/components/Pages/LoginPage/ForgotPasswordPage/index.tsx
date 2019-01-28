import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ChevronLeft';
import { reduxify } from 'src/shared/lib/redux-helper';
import { forgotPasswordAction } from '@stores/actions/pages/login';
import { RouteProps } from 'react-router';
import { AppMain } from 'src/shared/components/Common/AppMain';
import { formStyles } from '../styles';
import { getRouterHistoryBack } from 'src/shared/helpers/router/index';
import { IReduxOwnProps, IReduxStore } from "src/shared/stores/reducers/types";
import { ClickEvent, InputChangeEvent } from "src/shared/interfaces/common/react";
import { FormattedMessage } from 'react-intl';

interface ForgotPasswordPageProps extends WithStyles<typeof formStyles>, RouteProps {
    dispatch?: Function;
    routerGoBack: Function;
    sendForgotRequest: Function;
}

interface ForgotPasswordPageState {
    email: string;
}

export class ForgotPasswordPageBase extends React.Component<ForgotPasswordPageProps, ForgotPasswordPageState> {
    public state: ForgotPasswordPageState = {
        email: '',
    };

    public handleChange = (e: InputChangeEvent) => {
        this.setState({ email: e.target.value });
    };

    public submitRequest = (e: ClickEvent) => {
        this.props.sendForgotRequest(this.state.email);
    };

    public render() {
        const { classes, routerGoBack } = this.props;
        const { email } = this.state;

        return (
            <AppMain>
                <Grid
                    item xs={ 12 }
                    container
                    justify="center"
                >
                    <Paper className={ classes.forgot }>
                        <Typography color="primary" variant="headline"
                                    paragraph>
                            <FormattedMessage id={ 'recovery.password.title' } />
                        </Typography>
                        <Typography variant="title" paragraph>
                            <FormattedMessage id={ 'enter.email.address.message' } />
                        </Typography>
                        <form autoComplete="off">
                            <TextField
                                required
                                inputProps={ { type: 'email' } }
                                label={ <FormattedMessage id={ 'email.label' } /> }
                                className={ classes.email }
                                value={ email }
                                helperText={ <FormattedMessage id={ 'email.label' } /> }
                                FormHelperTextProps={{
                                    classes: {
                                        root: classes.placeholder,
                                        filled: email.length > 0 ? classes.filled : null
                                    }
                                }}
                                onChange={ this.handleChange }
                            />
                        </form>
                        <Grid container justify="flex-end">
                            <Button
                                variant="outlined"
                                color="primary"
                                className={ classes.passwordButtons }
                                onClick={ () => routerGoBack() }
                            >
                                <BackIcon />
                                <FormattedMessage id={ 'word.back.title' } />
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className={ classes.passwordButtons }
                                onClick={ this.submitRequest }
                            >
                                <FormattedMessage id={ 'word.submit.title' } />
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>
            </AppMain>
        );
    }
}

const ForgotPassword = withStyles(formStyles)(ForgotPasswordPageBase);

export const ForgotPasswordPage = reduxify(
    (state: IReduxStore, ownProps: IReduxOwnProps) => {
        const routerGoBack = getRouterHistoryBack(state, ownProps);
        return (
            {
                routerGoBack,
            }
        );
    },
    (dispatch: Function) => {
        return {
            dispatch,
            sendForgotRequest: (email: string) => dispatch(forgotPasswordAction(email)),
        };
    },
)(ForgotPassword);

export default ForgotPasswordPage;
