import SignUpForm from "../../../components/myComps/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="container max-w-[440px] mt-24 border-4 rounded-xl p-8">
      <h1 className=" text-4xl bg-gradient-to-r from-amber-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-bold">
        Register Page
      </h1>
      <div className="h-6" />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
