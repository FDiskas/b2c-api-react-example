import * as React from 'react';
import { toast } from 'react-toastify';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { EmptyRequiredFieldsErrorMessage } from 'src/shared/translation';
import { CustomerPageTitle } from 'src/shared/components/Common/CustomerPageTitle';
import { SprykerButton } from 'src/shared/components/UI/SprykerButton';
import { SprykerForm } from 'src/shared/components/UI/SprykerForm';

import { styles } from '../styles';
import { AddressFormProps as Props, AddressFormState as State } from './types';
import { connect } from './connect';
import { setFormFields, IFieldInput } from './settings';
import { FormEvent, InputChangeEvent } from 'src/shared/interfaces/common/react';
import {
    ButtonSaveTitle,
    ButtonEditTitle,
    ButtonAddNewTitle,
    AddressTitle
} from 'src/shared/translation';

@connect
export class AddressForm extends React.Component<Props, State> {
    public state: State = {
        salutation: '',
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        address3: '',
        zipCode: '',
        city: '',
        country: '',
        iso2Code: '',
        phone: '',
        isDefaultShipping: false,
        isDefaultBilling: false,
        submitted: false
    };

    public componentDidMount = () => {
        if (this.props.currentAddress) {
            this.setInitialData();
        } else if (!this.props.isAddressExist
            || (this.props.isAddressExist && this.props.addressIdParam !== this.props.currentAddress.id)
        ) {
            this.initRequestData();
        }
    };

    public componentDidUpdate = (prevProps: Props, prevState: State) => {

        // After updating data
        if (!prevState.submitted && this.state.submitted) {
            this.props.routerGoBack();
            return;
        }
        // First load of the page
        if (!this.props.isRejected && !this.props.isAddressExist && !this.state.submitted) {
            this.initRequestData();
        }

        if (!prevProps.isAddressExist && this.props.isAddressExist) {
            this.setInitialData();
        }
    };


    public handleChange = (event: { target: IFieldInput }): void => {
        const { name, value }: IFieldInput = event.target;
        this.setState(state => ({ ...state, [ name ]: value }));
    };

    public handleCheckbox = (event: InputChangeEvent): void => {
        event.persist();
        this.setState((prevState: State) => ({ ...prevState, [ event.target.name ]: !prevState[ event.target.name ] }));
    };

    public handleSubmitForm = (e: FormEvent) => {
        e.preventDefault();
        const { salutation, firstName, lastName, address1, address2, zipCode, city, iso2Code } = this.state;
        this.setState(() => ({ submitted: true }));

        if (!salutation || !firstName || !lastName || !address1 || !address2 || !zipCode || !city || !iso2Code) {
            toast.warn(EmptyRequiredFieldsErrorMessage);
            return;
        }

        const payload = { ...this.state };
        delete payload.submitted;

        if (this.props.currentAddress) {
            this.props.updateAddress(this.props.currentAddress.id, this.props.customer, payload);
        } else {
            this.props.addAddress(payload, this.props.customer);
        }
    };

    private initRequestData = () => {
        if (this.props.isLoading) {
            return;
        }
        if (this.props.isAppDataSet && this.props.customer && this.props.addressIdParam) {
            this.props.getOneAddress(this.props.customer, this.props.addressIdParam);
        }
    };

    private setInitialData = () => {
        const { currentAddress } = this.props;
        const isAddressDataExist = Boolean(currentAddress);

        const stateData = {
            salutation: isAddressDataExist ? currentAddress.salutation : '',
            firstName: isAddressDataExist ? currentAddress.firstName : '',
            lastName: isAddressDataExist ? currentAddress.lastName : '',
            company: isAddressDataExist ? currentAddress.company || '' : '',
            address1: isAddressDataExist ? currentAddress.address1 : '',
            address2: isAddressDataExist ? currentAddress.address2 : '',
            address3: isAddressDataExist ? currentAddress.address3 || '' : '',
            zipCode: isAddressDataExist ? currentAddress.zipCode : '',
            city: isAddressDataExist ? currentAddress.city : '',
            country: isAddressDataExist ? currentAddress.country : '',
            iso2Code: isAddressDataExist ? currentAddress.iso2Code : '',
            phone: isAddressDataExist ? currentAddress.phone || '' : '',
            isDefaultShipping: isAddressDataExist && currentAddress.isDefaultShipping,
            isDefaultBilling: isAddressDataExist && currentAddress.isDefaultBilling,
            submitted: false
        };
        this.setState((prevState: State) => ({
            ...prevState,
            ...stateData
        }));
    };

    public render(): JSX.Element {
        const { classes, currentAddress, countries, routerGoBack, isLoading } = this.props;
        const pageTitle = `${currentAddress ? ButtonAddNewTitle : ButtonEditTitle} AddressTitle`;
        const currentState = { ...this.state };

        return (
            <Grid container>
                <Grid item xs={ 12 }>
                    <CustomerPageTitle title={ pageTitle } />
                </Grid>

                <Grid item xs={ 9 }>
                    <SprykerForm
                        form={ {
                            formName: 'addressForm',
                            onChangeHandler: this.handleChange,
                            onSubmitHandler: this.handleSubmitForm,
                            fields: setFormFields(currentState, countries, this.handleCheckbox)
                        } }
                        SubmitButton={
                            <Grid container>
                                <Grid item xs={ 12 } sm={ 4 }>
                                    <SprykerButton
                                        title={ ButtonSaveTitle }
                                        btnType="submit"
                                        extraClasses={classes.addButton}
                                        disabled={ isLoading }
                                    />
                                </Grid>
                            </Grid>
                        }
                    />
                </Grid>
                <Grid item xs={ 12 } className={ classes.addButton }>
                    <Button
                        color="primary"
                        onClick={ () => routerGoBack() }
                        disabled={ isLoading }
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export const AddressFormPage = withStyles(styles)(AddressForm);
