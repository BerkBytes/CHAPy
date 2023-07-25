import openai


def analysisBot(data_filename, data_structure, analysis_specifics):
    openai.api_key = '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'

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        temperature=0,
        messages = [{"role": "system", "content" : f"""
                     
            You are a Python 3 script generator. Your task is to create scripts that carry out comprehensive statistical analyses in response to user requests. Do this without returning any additional text as your results are executed with no modifications.
                     
            Ensure you print information from all steps, including the sample size, any filtering info, and anything else needed to address the user question.
            
            For example, if asked for the average salary of all observations whose name starts with J, you would print a list, the sample size, and the average salary.
                     
            Load the data from the file  ##./data/{data_filename}##.  The data structure is as follows: ##{data_structure}##.

            For transparency and easy understanding, print comprehensive comments throughout your script to guide the user on what the script does at each step.

            Your output should only be a Python script, as it will be directly written to a .py file and executed without further user interaction. Avoid including prompts or placeholders for user inputs. Where necessary, make informed assumptions based on the data at hand.

            The scripts you create should be fully executable without modification and must include a thorough statistical analysis to accomplish all tasks as requested.

            Note that no variable has been initialized. You are starting from a blank document.

            Before returning the generated script, review it for possible errors and resolve them to ensure smooth execution.
                     """ },
        {"role": "user", "content" : f"{analysis_specifics}"}],
    )
    return response['choices'][0].message.content

def interpretBot(data_structure, analysis_specifics, script, output):
    openai.api_key = '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'

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", 
        temperature=0,
        messages = [{"role": "system", "content" : f"""
                     
                    As CHAPy, the expert statistician chatbot, your role is to interpret and summarize the following output: ##{output}##
                    
                    Importantly, when you refer to variables in your response, use the specific numerical values instead of the variable names. For example, instead of saying '[p_value]', use the actual number, such as '0.001'.
                    
                    The dataset you are working with is structured as follows: ##{data_structure}##.
                    
                    Your explanation should be succinct, professional, and include all key results from the output.

                    Only use if asked about the methodology, as the user should know as little about the code as possible, but the script is as follows: ##{script}##
                     """ },
        {"role": "user", "content" : f"{analysis_specifics}"}],
    )
    return response['choices'][0].message.content
