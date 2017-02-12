import wolframalpha
while True:
        input = raw_input ("Question: ")
        if input == 'end':
                break
        app_id = 'E7V5U9-LPU643H76T'
        client = wolframalpha.Client(app_id)

        res = client.query(input)
        answer = next(res.pods).text
        answer2 = next(res.results).text
        print answer2
        print answer