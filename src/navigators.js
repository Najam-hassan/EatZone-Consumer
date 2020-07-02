import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createDrawerNavigator,
} from 'react-navigation';

import MainApp from './MainApp';
import Switcher from './Switcher';

// App Screens (Commons Screens)
import HomeScreen from './screens/common/home-screen';
import SignInScreen from './screens/common/signin-screen';
import SignUpScreen from './screens/common/signup-screen';
import WelcomeScreen from './screens/common/welcome-screen';
import ForgotPasswordScreen from './screens/common/forget-password-screen';

// Auth Screens (Users Screens)
import TestScreen from './screens/test-screen';
import OrderScreen from './screens/user-screens/orders-screen';
import ProfileScreen from './screens/user-screens/profile-screen';
import ItemCartScreen from './screens/user-screens/item-cart-screen';
import ItemDetailScreen from './screens/user-screens/item-details-screen';
import OrderDetailScreen from './screens/user-screens/order-detail-screen';
import RestaurantsScreen from './screens/user-screens/near-by-restaurants';
import RestaurantDetailScreen from './screens/user-screens/restaurant-detsils-screen';

// Auth Screens (Restaurant Screens)
import CategoryScreen from './screens/restutant-screens/category-screen';
import MenuItemsScreen from './screens/restutant-screens/menu-items-screen';
import CreateItemScreen from './screens/restutant-screens/add-menu-item-screen';
import RecentOrdersScreen from './screens/restutant-screens/recent-orders-screen'
import TransactionHistoryScreen from './screens/restutant-screens/transaction-history-screen';
import EditRestaurantProfile from './screens/restutant-screens/edit-profile-screen';
import CreateRestaurantProfile from './screens/restutant-screens/create-profile-screen';
import CompletedOrdersScreen from './screens/restutant-screens/completed-orders-screen';
import ResturantOrderDetailsScreen from './screens/restutant-screens/order-details-screen';

// Side Drawer (Side Navigation component)
import SidebarMenu from './components/common/sidebar-menu';

//Stripe
import StripDashboard from './screens/stripe/strip-dashboard';
import StripeConnectHome from './screens/stripe/stripe-home-screen';
import StripeConnectWebview from './screens/stripe/stripe-connect-webview';

const AuthStack = createStackNavigator({
    // Common Screens will goo here
    HomeScreen: HomeScreen,
    TestScreen: TestScreen,

    // User Screens will go here
    OrderScreen: OrderScreen,
    ProfileScreen: ProfileScreen,
    ItemCartScreen: ItemCartScreen,
    ItemDetailScreen: ItemDetailScreen,
    RestaurantsScreen: RestaurantsScreen,
    OrderDetailScreen: OrderDetailScreen,
    RestaurantDetailScreen: RestaurantDetailScreen,

    //Restaurants screens will go here
    CategoryScreen: CategoryScreen,
    MenuItemsScreen: MenuItemsScreen,
    CreateItemScreen: CreateItemScreen,
    RecentOrdersScreen: RecentOrdersScreen,
    EditRestaurantProfile: EditRestaurantProfile,
    CompletedOrdersScreen: CompletedOrdersScreen,
    // CreateRestaurantProfile: CreateRestaurantProfile,
    ResturantOrderDetailsScreen: ResturantOrderDetailsScreen,
    TransactionHistoryScreen: TransactionHistoryScreen,
    StripeSignUp: StripeConnectWebview,
    StripeConnectHome: StripeConnectHome,
    StripDashboard: StripDashboard
}, {
        headerMode: 'none',
        initialRouteName: 'HomeScreen',
        // initialRouteName: 'RecentOrdersScreen',
        defaultNavigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#edebed',
            }
        },
    }
);

const Drawerstack = createDrawerNavigator({
    AuthStack: AuthStack,
}, { contentComponent: SidebarMenu });

const Dashboard = createStackNavigator({
    Drawerstack: Drawerstack,
}, {
        headerMode: 'none',
        defaultNavigationOptions: {
            gesturesEnabled: false
        }
    });

const LoginStack = createStackNavigator({
    SignUpScreen: SignUpScreen,
    SignInScreen: SignInScreen,
    WelcomeScreen: WelcomeScreen,
    ForgotPasswordScreen: ForgotPasswordScreen,
}, {
        headerMode: 'none',
        initialRouteName: 'WelcomeScreen',
        defaultNavigationOptions: {
            gesturesEnabled: false
        }
    }
);

export default AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: MainApp,
            Switcher: Switcher,
            App: Dashboard,
            Auth: LoginStack,
        },
        {
            initialRouteName: 'AuthLoading',
            transitionConfig: () => ({
                screenInterpolator: (sceneProps) => {
                }
            })
        }
    )
);
